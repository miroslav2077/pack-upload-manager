import { z } from 'zod/v4';
import { MAX_FILE_SIZE } from './utils';

// Accepted values
export const categoryOptions = ['Leadership', 'Managing Complexity'] as const;
export const languageOptions = ['en', 'it', 'es'] as const;
export const providerOptions = ['Skilla', 'Linkedin', 'Pack', 'Mentor'] as const;
export const roleOptions = ['Mentor/Coach', 'Mentee/Coachee'] as const;

export const UploadSchema = z.object({
  title: z.string().trim().min(1, { error: 'Title is required' }).max(200),
  description: z.string().max(1000).optional().or(z.literal('')),
  category: z.union([z.literal(''), z.enum(categoryOptions)]).default('').refine(val => val !== '', {
    message: 'Category is required',
  }),
  language: z.union([z.literal(''), z.enum(languageOptions)]).default('').refine(val => val !== '', {
    message: 'Language is required',
  }),
  provider: z.union([z.literal(''), z.enum(providerOptions)]).default('').refine(val => val !== '', {
    message: 'Provider is required',
  }),
  roles: z.array(z.enum(roleOptions)).min(1, 'At least one role is required')
  .default([]),
  file: z
    .any()
    .refine((file) => file instanceof File && file?.size > 0, {
      message: 'File is required',
    })
    .refine((file) => file instanceof File && file?.size <= MAX_FILE_SIZE, {
      message: 'File must be smaller than 80MB',
    }),
});

export type UploadFormData = z.infer<typeof UploadSchema>;