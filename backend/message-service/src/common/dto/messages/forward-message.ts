import z from 'zod';

export const ForwardMessageDtoSchema = z.object({
  convIds: z.array(z.string()),
  messageId: z.string(),
  userForward: z.string(),
});
export type ForwardMessageDto = z.infer<typeof ForwardMessageDtoSchema>;
