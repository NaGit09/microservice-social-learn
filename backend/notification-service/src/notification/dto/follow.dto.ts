import { z } from 'zod';
const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

export const FollowDtoSchema = z.object({
  actorId: objectId,
  receiverId: objectId,
});

export type FollowDto = z.infer<typeof FollowDtoSchema>;
