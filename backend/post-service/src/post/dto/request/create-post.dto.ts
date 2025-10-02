import z from 'zod';
import { FileSchema } from './file.dto';
import { PostMode } from 'src/post/enums/post.enum';

export const CreatePostSchema = z.object({
  author: z.string().min(1, 'author is required'),

  files: z.array(FileSchema).default([]),

  caption: z.string().optional(),

  mode: z
    .enum(Object.values(PostMode) as [string, ...string[]])
    .default(PostMode.PUBLIC),

  isShare: z.boolean().default(false),

  sharePost: z.string().nullable().optional(),
});
export type CreatePostDto = z.infer<typeof CreatePostSchema>;
