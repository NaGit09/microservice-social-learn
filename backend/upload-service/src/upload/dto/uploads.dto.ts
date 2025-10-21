import { isValidFile } from 'src/upload/utils/validion';
import { z } from 'zod';

export const UploadFilesDto = z.object({
  userId: z.string().min(1, 'userId is required'),
  files: z
    .array(
      z.custom<Express.Multer.File>(isValidFile, {
        message: 'Each file must be an image (jpg, jpeg, png, gif) and <= 25MB',
      }),
    )
    .nonempty('At least one file is required'),
});

export type UploadFilesDtoType = z.infer<typeof UploadFilesDto>;
