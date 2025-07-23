import { message, superValidate, fail } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { UploadSchema } from '$lib/schemas';
import prisma from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import { saveFileLocally, saveFileToS3Bucket } from '$lib/server/upload.js';
import { StorageType } from '../generated/prisma/enums';

const CLOUD_STORAGE = process.env.CLOUD_STORAGE === 'true';
const UPLOAD_FOLDER = process.env.UPLOAD_FOLDER || 'uploads';

export const load = async () => {
  try {
    const form = await superValidate(zod4(UploadSchema));

    const results = await prisma.upload.findMany({
      orderBy: { createdAt: 'desc' }, // latest uploads first
      take: 100,
    });

     // Get bucket name and region
    const bucket = process.env.BUCKET_NAME;
    const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'us-east-1';

    // add computed fileUrl
    const resultsWithUrl = results.map((upload) => {
      let fileUrl = '';

      if (upload.storage === StorageType.CLOUD) {
        fileUrl = `https://${bucket}.s3.${region}.amazonaws.com/${upload.filePath}`;
      } else {
        // serve local files from /uploads/ path
        fileUrl = `/${UPLOAD_FOLDER}/${upload.filePath}`;
      }

      return { ...upload, filePath: fileUrl };
    });

    return { form, results: resultsWithUrl };
  } catch (err) {
    console.error('Load function failed:', err);
    throw error(500, 'Failed to load form and/or fetch uploaded resources.');
  }
};

export const actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, zod4(UploadSchema));

    if (!form.valid || !form.data.file) {
      console.warn('Invalid form', form);
      return fail(400, { form, message: 'Form validation failed.' });
    }

    let filePath = '';
    let storageType: StorageType = StorageType.LOCAL;

    let backupToLocalStorage = !CLOUD_STORAGE;

    if (!backupToLocalStorage) {
      try {
        filePath = await saveFileToS3Bucket(form.data.file);
        storageType = StorageType.CLOUD;

      } catch (s3Err) {
        console.error('Cloud file upload error:', s3Err);
        console.warn('Fallback to local file upload');

        // mutating to fallback to local storage
        backupToLocalStorage = true;
      }
    }

    if (backupToLocalStorage) {
      try {
        filePath = await saveFileLocally(form.data.file);
        storageType = StorageType.LOCAL;
        
      } catch (err) {
        console.error('Local file upload error:', err);
        return fail(400, { form, message: err instanceof Error ? err.message : String(err) });
      }
    }
    
    try {
      // save data to DB
      const dbData = { ...form.data, filePath, originalName: form.data.file.name, mimeType: form.data.file.type, size: form.data.file.size, storage: storageType };
      delete dbData.file;
      
      await prisma.upload.create({
        data: dbData
      });

      return message(form, 'Resource uploaded successfully!'); 
    } catch (err) {
      console.error('Database error:', err);
      return fail(500, { form, message: 'An unexpected error occurred while saving the data.'});
    }
  }
};