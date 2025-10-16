import z from 'zod';

export const ReactSchemaDto = z.object({
  userId: z.string(),
  reactType: z.number(),
});
