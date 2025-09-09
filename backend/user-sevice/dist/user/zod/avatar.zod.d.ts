import { z } from 'zod';
export declare const AvatarSchemaZ: z.ZodObject<{
    avatarId: z.ZodString;
    url: z.ZodDefault<z.ZodString>;
    type: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export type AvatarDto = z.infer<typeof AvatarSchemaZ>;
