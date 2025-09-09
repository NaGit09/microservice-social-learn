import { z } from 'zod';
import { AddressSchemaZ } from '../zod/address.zod';
export const UpdateAddressDto = z.object({
  userId: z.string(),
  address: AddressSchemaZ,
});

export type UpdateAddressDto = z.infer<typeof UpdateAddressDto>;
