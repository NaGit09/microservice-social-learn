import { z } from 'zod';

export const UpdateBioDto = z.object({
  userId: z.string('UserId không được null'),
  bio: z.string(),
});

export type UpdateBioDto = z.infer<typeof UpdateBioDto>;
