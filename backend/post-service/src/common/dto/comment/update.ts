import { z } from 'zod';
import { FileSchema } from '../file.dto';

export const UpdateCommentDto = z.object({
  commentId: z.string().min(1, 'commentId is required'),
  content: z.string().min(1, 'content cannot be empty').optional(),
  tag: z.string().optional(),
  file: FileSchema.optional(),
});

export type UpdateCommentDto = z.infer<typeof UpdateCommentDto>;
