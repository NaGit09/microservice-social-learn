import { z } from 'zod';
export const FollowDtoSchema = z.object({
  id: z.string(),
  actorId: z.string(),
  receiverId: z.string(),
});

export type FollowDto = z.infer<typeof FollowDtoSchema>;
