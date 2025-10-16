import { z } from 'zod';
import { FileSchema } from '../messages/file-dto';

export const AvatarConvDtoSchema = z.object({
  convId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Conversation ID'),
  userId: z.string(),
  file: FileSchema,
});

export type AvatarConvDto = z.infer<typeof AvatarConvDtoSchema>;
