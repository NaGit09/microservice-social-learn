// src/user/zod/address.zod.ts
import { z } from 'zod';

export const AddressSchemaZ = z.object({
  country: z.string(),
  province: z.string(),
  district: z.string(),
});

export type AddressDto = z.infer<typeof AddressSchemaZ>;
