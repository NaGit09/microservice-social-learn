import { z } from 'zod';

export const AcceptConvDtoSchema = z.object({
  convId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Conversation ID'),

  userId: z.string(),
});

export type AcceptConvDto = z.infer<typeof AcceptConvDtoSchema>;
