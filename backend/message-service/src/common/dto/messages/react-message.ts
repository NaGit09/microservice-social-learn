import { z } from 'zod';
import { ReactSchemaDto } from './react-dto';

export const ReactMessageDtoSchema = z.object({
  messageId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Conversation ID'),
  react: ReactSchemaDto,
});

export type ReactMessageDto = z.infer<typeof ReactMessageDtoSchema>;
