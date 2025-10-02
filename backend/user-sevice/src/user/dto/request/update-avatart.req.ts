import { z } from 'zod';

export const UpdateAvatarDtoSchema = z.object({
  userId: z.string().nonempty({ message: 'UserId is not null' }),
  avatar: z.object({
    fileId: z.string(),
    fileName: z.string(),
    url: z.url(),
    type: z.string(),
  }),
});

export type UpdateAvatartDto = z.infer<typeof UpdateAvatarDtoSchema>;
