// delete-comment.response.ts
import { z } from 'zod';

export const DeleteCommentResponseSchema = z.object({
  message: z.string(),
  deletedId: z.string(),
});

export type DeleteCommentResponse = z.infer<typeof DeleteCommentResponseSchema>;
