import z from 'zod';

export const DeleteFollowDtoSchema = z.object({
  requestId: z.string(),
  targetId: z.string(),
});
export type DeleteFollowDto = z.infer<typeof DeleteFollowDtoSchema>;
