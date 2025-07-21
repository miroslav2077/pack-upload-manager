import { message, superValidate, fail } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { UploadSchema } from '$lib/schemas';
import prisma from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import { saveFileLocally } from '$lib/server/upload.js';

export const load = async () => {
  try {
    const form = await superValidate(zod4(UploadSchema));

    const results = await prisma.upload.findMany({
      orderBy: { createdAt: 'desc' } // latest uploads first
    });

    return { form, results };
  } catch (err) {
    console.error('Load function failed:', err);
    throw error(500, 'Failed to load form and/or fetch uploaded resources.');
  }
};

export const actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, zod4(UploadSchema));
    console.log(form);

    if (!form.valid || !form.data.file) {
      return fail(400, { form });
    }

    // TODO save file locally

    const filePath = await saveFileLocally(form.data.file);

    try {
      // save data to DB
      const dbData = { ...form.data, filePath }; // TODO implement local/cloud storage logic
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