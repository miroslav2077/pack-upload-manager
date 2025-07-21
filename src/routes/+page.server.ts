import { message, superValidate, fail } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { UploadSchema } from '$lib/schemas';

export const load = async () => {
  const form = await superValidate(zod4(UploadSchema));

  return { form };
};

export const actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, zod4(UploadSchema));
    console.log(form);

    if (!form.valid || !form.data.file) {
      return fail(400, { form });
    }

    // TODO save file locally

    // TODO save data to DB

    return message(form, 'Resource uploaded successfully!');
  }
};