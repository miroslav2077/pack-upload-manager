import { message, superValidate, fail } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { UploadSchema } from '$lib/schemas';
import prisma from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import { saveFileLocally } from '$lib/server/upload.js';
import { CLOUD_STORAGE, UPLOAD_FOLDER } from '$env/static/private';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { StorageType } from '../generated/prisma/enums';
import cuid from 'cuid';

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
      return fail(400, { form });
    }

    let filePath = '';
    let storageType: StorageType = StorageType.LOCAL;

    if (CLOUD_STORAGE === 'true') {
      try {
        const arrayBuffer = await form.data.file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const s3 = new S3Client({});
        const key = `${cuid()}_${form.data.file.name}`;
        const command = new PutObjectCommand({
          Key: key,
          Bucket: process.env.BUCKET_NAME,
          Body: buffer,
          ContentType: form.data.file.type
        });

        await s3.send(command);
        filePath = key;
        storageType = StorageType.CLOUD;
      } catch (err2) {
        console.error('Cloud file upload error:', err2);
        console.warn('Reverting to local file upload');
        try {
          filePath = await saveFileLocally(form.data.file);
        } catch (err) {
          console.error('Local file upload error:', err);
          return fail(400, { form, message: err instanceof Error ? err.message : String(err) });
        }
      }
      
    } else {
      try {
        filePath = await saveFileLocally(form.data.file);
      } catch (err) {
        console.error('Local file upload error:', err);
        return fail(400, { form, message: err instanceof Error ? err.message : String(err) });
      }
    }


    
    try {
      // save data to DB
      const dbData = { ...form.data, filePath, originalName: form.data.file.name, mimeType: form.data.file.type, size: form.data.file.size, storage: storageType }; // TODO implement cloud storage logic
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