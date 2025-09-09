import { z } from 'zod';
export declare const UpdateAddressDto: z.ZodObject<{
    userId: z.ZodString;
    address: z.ZodObject<{
        country: z.ZodString;
        province: z.ZodString;
        district: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type UpdateAddressDto = z.infer<typeof UpdateAddressDto>;
