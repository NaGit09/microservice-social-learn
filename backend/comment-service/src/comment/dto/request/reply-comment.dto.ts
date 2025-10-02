import { z } from 'zod';
import { FileSchema } from './file.dto';

export const ReplyCommentDto = z.object({
  userId: z.string().min(1, 'userId is required'),
  postId: z.string().min(1, 'postId is required'),
  reply: z.string().min(1, 'reply commentId is required'), // id của comment cha
  content: z.string().min(1, 'content is required'),
  isRoot: z.boolean().default(false),
  tag: z.string().optional(),
  file: FileSchema.optional(),
});

export type ReplyCommentDto = z.infer<typeof ReplyCommentDto>;
