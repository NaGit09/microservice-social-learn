import { z } from 'zod';
export declare const UpdateBioDto: z.ZodObject<{
    userId: z.ZodString;
    bio: z.ZodString;
}, z.core.$strip>;
export type UpdateBioDto = z.infer<typeof UpdateBioDto>;
