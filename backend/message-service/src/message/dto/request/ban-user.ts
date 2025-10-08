import { z } from 'zod';

export const BanUserDtoSchema = z.object({
  convId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Conversation ID'),
  owner: z.string(),
  userBan: z.string(),
});

export type BanUserDto = z.infer<typeof BanUserDtoSchema>;
