import { z } from 'zod';
export declare const AddressSchemaZ: z.ZodObject<{
    country: z.ZodString;
    province: z.ZodString;
    district: z.ZodString;
}, z.core.$strip>;
export type AddressDto = z.infer<typeof AddressSchemaZ>;
