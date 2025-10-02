import z from 'zod';
export const FileSchema = z.object({
  fileId: z.string().min(1, 'fileId is required'),
  fileName: z.string(),
  url: z.url('Invalid file url'),
  type: z.string(),
});
