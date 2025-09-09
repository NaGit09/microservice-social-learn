// src/user/zod/avatar.zod.ts
import { z } from 'zod';

export const AvatarSchemaZ = z.object({
  avatarId: z.string(),
  url: z.string().default(''),
  type: z.string().default('image'),
});

export type AvatarDto = z.infer<typeof AvatarSchemaZ>;
