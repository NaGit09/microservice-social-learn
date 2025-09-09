// src/user/zod/profile.zod.ts
import { z } from 'zod';

export const ProfileSchemaZ = z.object({
  school: z.string(),
  major: z.string(),
  class: z.string(),
  year: z.number(),
  references: z.array(z.string()).default([]),
});

export type ProfileDto = z.infer<typeof ProfileSchemaZ>;
