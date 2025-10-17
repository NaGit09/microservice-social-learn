import { z } from 'zod';

export const UpdateBioDtoSchema = z.object({
  userId: z.string().nonempty({ message: 'UserId is not null' }),
  bio: z.string(),
});

export type UpdateBioDto = z.infer<typeof UpdateBioDtoSchema>;
