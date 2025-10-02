import { z } from 'zod';
export const FollowNotifySchema = z.object({
  id: z.string(),
  actorId: z.string(),
  receiverId: z.string(),
});

export type FollowNotifyDto = z.infer<typeof FollowNotifySchema>;
