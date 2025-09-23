import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

export const CommentDtoSchema = z.object({
  actorId: objectId,
  receiverId: objectId,
  entityId: objectId,
  entityTitle: z.string(),
  tag: objectId,
});

export type CommentDto = z.infer<typeof CommentDtoSchema>;
