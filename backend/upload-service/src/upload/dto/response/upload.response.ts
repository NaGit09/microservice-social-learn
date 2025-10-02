import z from 'zod';

export const UploadDtoSchema = z.object({
  fileId: z.string(),
  url: z.string(),
  type: z.string(),
  fileName: z.string(),
});
export type UploadDto = z.infer<typeof UploadDtoSchema>;
