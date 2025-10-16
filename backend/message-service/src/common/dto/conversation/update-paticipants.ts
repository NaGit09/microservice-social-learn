import { z } from 'zod';

export const UpdatePaticipantsDtoSchema = z.object({
  convId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Conversation ID'),
  userIds: z.array(z.string()),
});

export type UpdatePaticipantsDto = z.infer<typeof UpdatePaticipantsDtoSchema>;
