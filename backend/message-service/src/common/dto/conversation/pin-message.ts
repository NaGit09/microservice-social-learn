import { z } from 'zod';

export const PinMessageDtoSchema = z.object({
  convId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Conversation ID'),
  messageId: z.string(),
  userId: z.string(),
});

export type PinMessageDto = z.infer<typeof PinMessageDtoSchema>;
