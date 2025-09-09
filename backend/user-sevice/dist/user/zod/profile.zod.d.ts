import { z } from 'zod';
export declare const ProfileSchemaZ: z.ZodObject<{
    school: z.ZodString;
    major: z.ZodString;
    class: z.ZodString;
    year: z.ZodNumber;
    references: z.ZodDefault<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type ProfileDto = z.infer<typeof ProfileSchemaZ>;
