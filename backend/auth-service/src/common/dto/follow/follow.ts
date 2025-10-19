import z from 'zod';

export const CreateFollowDtoSchema = z.object({
  requestId: z.string(),
  targetId: z.string(),
  status: z.string().optional(),
});
export type CreateFollowDto = z.infer<typeof CreateFollowDtoSchema>;
