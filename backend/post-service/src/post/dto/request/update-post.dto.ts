import { z } from 'zod';
import { FileSchema } from './file.dto';
import { PostMode } from '../../enums/post.enum';

export const UpdatePost = z.object({
  postId: z.string(),

  filesToAdd: z.array(FileSchema).optional(),

  filesToRemove: z.array(z.string().min(1)).optional(),

  caption: z.string().min(1, 'Caption cannot be empty').optional(),

  mode: z
    .enum(Object.values(PostMode) as [string, ...string[]])
    .default(PostMode.PUBLIC),
});

export type UpdatePostDto = z.infer<typeof UpdatePost>;
