import { z } from 'zod';
export declare const UserSchemaZ: z.ZodObject<{
    bio: z.ZodDefault<z.ZodString>;
    address: z.ZodObject<{
        country: z.ZodString;
        province: z.ZodString;
        district: z.ZodString;
    }, z.core.$strip>;
    profile: z.ZodObject<{
        school: z.ZodString;
        major: z.ZodString;
        class: z.ZodString;
        year: z.ZodNumber;
        references: z.ZodDefault<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
    avatar: z.ZodObject<{
        avatarId: z.ZodString;
        url: z.ZodDefault<z.ZodString>;
        type: z.ZodDefault<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type UserDto = z.infer<typeof UserSchemaZ>;
