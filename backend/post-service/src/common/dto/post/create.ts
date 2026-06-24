import z from 'zod';
import { PostMode } from 'src/common/enums/post.enum';
import { PostType } from 'src/common/enums/post-type.enum';
import { FileSchema } from '../file.dto';

export const CreatePostSchema = z.object({
  author: z.string().min(1, 'author is required'),

  files: z.array(FileSchema).default([]),

  caption: z.string().optional(),

  mode: z
    .enum(Object.values(PostMode) as [string, ...string[]])
    .default(PostMode.PUBLIC),

  type: z
    .enum(Object.values(PostType) as [string, ...string[]])
    .default(PostType.STANDARD),

  isShare: z.boolean().default(false),

  sharePost: z.string().nullable().optional(),
});
export type CreatePostDto = z.infer<typeof CreatePostSchema>;
