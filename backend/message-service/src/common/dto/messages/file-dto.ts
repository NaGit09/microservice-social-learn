import z from 'zod';

export const FileSchema = z.object({
  fileId: z.string(),
  fileName: z.string().optional(),
  url: z.string().default(''),
  type: z.string().default('image'),
});
