import { ReactSchema } from 'src/message/entities/react.entity';
import { z } from 'zod';

export const AcceptConvDtoSchema = z.object({
  convId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Conversation ID'),
  senderId: z.string(),
  react: z.object(ReactSchema),
});

export type AcceptConvDto = z.infer<typeof AcceptConvDtoSchema>;
