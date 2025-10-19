import { z } from 'zod';

export const ReadMessageDtoSchema = z.object({
  messageId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid message ID'),
  senderId: z.string(),
  convId: z.string()
});

export type ReadMessageDto = z.infer<typeof ReadMessageDtoSchema>;
