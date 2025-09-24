import { z } from 'zod';
const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

export const FollowNotifySchema = z.object({
  actorId: objectId,
  receiverId: objectId,
});

export type FollowNotifyDto = z.infer<typeof FollowNotifySchema>;
