import { z } from 'zod';

export const RecallMessageDtoSchema = z.object({
  convId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Conversation ID'),

  senderId: z.string(),
});

export type RecallMessageDto = z.infer<typeof RecallMessageDtoSchema>;
