import z from 'zod';
import { FileSchema } from '../request/file.dto';

export const CommentResponseSchema = z.object({
  id: z.string(),
  postId: z.string(),
  userId: z.string(),
  content: z.string(),
  tag: z.string().optional(),
  reply: z.string().optional(),
  isEdit: z.boolean().default(false),
  isRoot: z.boolean().default(false),
  file: FileSchema.optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CommentResponse = z.infer<typeof CommentResponseSchema>;
