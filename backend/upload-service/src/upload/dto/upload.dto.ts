import { z } from 'zod';
import { isValidFile } from '../utils/validion';

export const UploadFileDto = z.object({
  userId: z.string().min(1, 'userId is required'),
  file: z.custom<Express.Multer.File>(isValidFile, {
    message: 'Each file must be an image (jpg, jpeg, png, gif) and <= 25MB',
  }),
});

export type UploadFileDtoType = z.infer<typeof UploadFileDto>;
