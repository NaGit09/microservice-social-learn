import { z } from 'zod';

export const RecallMessageDtoSchema = z.object({
  messageId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid message ID'),
  senderId: z.string(),
});

export type RecallMessageDto = z.infer<typeof RecallMessageDtoSchema>;
