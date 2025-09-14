import z from 'zod';

export const unFollowDto = z.object({
  requestId: z.string(),
  targetId: z.string(),
});
export type DeleteDto = z.infer<typeof unFollowDto>;
