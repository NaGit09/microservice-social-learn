import { z } from 'zod';

export const OwnerConvDtoSchema = z.object({
  convId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Conversation ID'),
  oldOwner: z.string(),
  newOwner: z.string(),
});

export type OwnerConvDto = z.infer<typeof OwnerConvDtoSchema>;
