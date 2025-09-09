import { z } from 'zod';
import { ProfileSchemaZ } from '../zod/profile.zod';
export const UpdateProfileDto = z.object({
  userId: z.string(),
  profile: ProfileSchemaZ,
});

export type UpdateProfileDto = z.infer<typeof UpdateProfileDto>;
