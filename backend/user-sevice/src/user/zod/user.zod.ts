// src/user/zod/user.zod.ts
import { z } from 'zod';
import { AvatarSchemaZ } from './avatar.zod';
import { AddressSchemaZ } from './address.zod';
import { ProfileSchemaZ } from './profile.zod';

export const UserSchemaZ = z.object({
  bio: z.string().default(''),
  address: AddressSchemaZ,
  profile: ProfileSchemaZ,
  avatar: AvatarSchemaZ,
});

export type UserDto = z.infer<typeof UserSchemaZ>;
