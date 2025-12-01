import z from 'zod';

export const ReactSchemaDto = z.object({
  userId: z.string(),
  reactIcon: z.string(),
});
