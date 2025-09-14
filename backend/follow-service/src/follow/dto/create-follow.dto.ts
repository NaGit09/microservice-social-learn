import z from 'zod';

export const CreateFollowDto = z.object({
  requestId: z.string(),
  targetId: z.string(),
  status: z.string(),
});
export type CreateDto = z.infer<typeof CreateFollowDto>;
