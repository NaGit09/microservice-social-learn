import { z } from 'zod';
import { FileSchema } from './file.dto';
import { PostMode } from '../enums/post.enum';

export const UpdatePost = z.object({
  postId: z.string(),
  // danh sách file muốn thêm
  filesToAdd: z.array(FileSchema).optional(),

  // danh sách fileId muốn xóa
  filesToRemove: z.array(z.string().min(1)).optional(),

  // caption mới
  caption: z.string().min(1, 'Caption cannot be empty').optional(),

  // mode mới
  mode: z
    .enum(Object.values(PostMode) as [string, ...string[]])
    .default(PostMode.PUBLIC),
});

export type UpdatePostDto = z.infer<typeof UpdatePost>;
