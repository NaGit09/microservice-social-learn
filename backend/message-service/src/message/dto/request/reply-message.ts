import { z } from 'zod';
import { MessageDtoSchema } from './create-message';

export const ReplyMessageDtoSchema = z.object({
  convId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Conversation ID'),
  messageId: z.string(),
  message: MessageDtoSchema,
});

export type ReplyMessageDto = z.infer<typeof ReplyMessageDtoSchema>;
