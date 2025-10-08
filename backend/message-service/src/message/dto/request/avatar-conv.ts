import { z } from 'zod';

export const AvatarConvDtoSchema = z.object({
  convId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Conversation ID'),
  file: z.object({
    fileId: z.string(),
    fileName: z.string(),
    url: z.string().default(''),
    type: z.string().default('image'),
  }),
});

export type AvatarConvDto = z.infer<typeof AvatarConvDtoSchema>;
