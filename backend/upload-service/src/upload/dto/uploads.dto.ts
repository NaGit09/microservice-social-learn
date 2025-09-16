import { z } from 'zod';
import { isValidImageFile } from '../utils/validion';

export const UploadFilesDto = z.object({
  userId: z.string().min(1, 'userId is required'),
  files: z
    .array(
      z.custom<Express.Multer.File>(isValidImageFile, {
        message: 'Each file must be an image (jpg, jpeg, png, gif) and <= 25MB',
      }),
    )
    .nonempty('At least one file is required'),
});

export type UploadFilesDtoType = z.infer<typeof UploadFilesDto>;
