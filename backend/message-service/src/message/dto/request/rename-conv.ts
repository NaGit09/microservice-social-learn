import { z } from 'zod';

export const RenameConvDtoSchema = z.object({
  convId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Conversation ID'),

  newName: z.string().trim().min(1, { message: 'Name cannot be empty.' }),
});

export type RenameConvDto = z.infer<typeof RenameConvDtoSchema>;
