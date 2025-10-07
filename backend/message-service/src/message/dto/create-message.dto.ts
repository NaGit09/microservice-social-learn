import { z } from 'zod';
export const CreateMessageSchemaDto = z.object({
  userId: z.string(),
});
export type CreateMessageSchema = z.infer<typeof CreateMessageSchemaDto>;
