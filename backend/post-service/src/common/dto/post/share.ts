import { PostMode } from 'src/common/enums/post.enum';
import z from 'zod';

export const SharePostDtoSchema = z.object({
  author: z.string().min(1, 'author is required'),

  caption: z.string().optional(),

  mode: z
    .enum(Object.values(PostMode) as [string, ...string[]])
    .default(PostMode.PUBLIC),

  isShare: z.boolean().default(true),

  sharePost: z.string(),
});
export type SharePostDto = z.infer<typeof SharePostDtoSchema>;
