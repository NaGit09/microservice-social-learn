import z from 'zod';
import { FileType } from '../enums/file.enum';

export const FileSchema = z.object({
  fileId: z.string().min(1, 'fileId is required'),
  url: z.url('Invalid file url'),
  type: z
    .enum(Object.values(FileType) as [string, ...string[]])
    .default(FileType.PDF), // có thể đổi sang enum nếu muốn
});
