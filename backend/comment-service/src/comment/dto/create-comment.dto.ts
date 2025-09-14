import { z } from 'zod';
import { FileSchema } from './file.dto';

export const CreateCommentDto = z.object({
  userId: z.string().min(1, 'userId is required'),
  postId: z.string().min(1, 'postId is required'),
  content: z.string().min(1, 'content cannot be empty'),
  tag: z.string().optional(),
  file: FileSchema.optional(),
});

export type CreateCommentDto = z.infer<typeof CreateCommentDto>;
