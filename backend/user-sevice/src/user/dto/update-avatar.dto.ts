import { z } from 'zod';
import { AvatarSchemaZ } from '../zod/avatar.zod';
export const UpdateAvatarDto = z.object({
  userId: z.string(),
  avatar: AvatarSchemaZ,
});

export type UpdateAvatarDto = z.infer<typeof UpdateAvatarDto>;
