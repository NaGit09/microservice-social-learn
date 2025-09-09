import { z } from 'zod';
export declare const UpdateProfileDto: z.ZodObject<{
    userId: z.ZodString;
    profile: z.ZodObject<{
        school: z.ZodString;
        major: z.ZodString;
        class: z.ZodString;
        year: z.ZodNumber;
        references: z.ZodDefault<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type UpdateProfileDto = z.infer<typeof UpdateProfileDto>;
