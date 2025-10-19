import { z } from 'zod';

export const EditMessageDtoSchema = z.object({
    messageId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid message ID'),
    convId: z.string(),
    senderId: z.string(),
    newContent: z.string(),
});

export type EditMessageDto = z.infer<typeof EditMessageDtoSchema>;
