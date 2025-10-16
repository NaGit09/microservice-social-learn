import z from 'zod';
import { CreateMessageDtoSchema } from '../messages/create-message';

export const CreateConvSchema = z
  .object({
    participants: z.array(z.string()).min(2, {
      message: 'A conversation must have at least two participants.',
    }),
    name: z.string().trim().min(1).optional(),
    isGroup: z.boolean().optional(),
    status: z.string().default('pending'),
    owner: z.string().optional(),
    latest: CreateMessageDtoSchema,
  })
  .refine(
    (data) => {
      if (data.isGroup) {
        return data.name && data.name.length > 0;
      }
      return true;
    },
    {
      message: 'Group chats must have a name.',
      path: ['name'],
    },
  );
export type ConversationDto = z.infer<typeof CreateConvSchema>;
