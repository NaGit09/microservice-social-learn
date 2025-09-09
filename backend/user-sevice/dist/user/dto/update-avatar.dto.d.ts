import { z } from 'zod';
export declare const UpdateAvatarDto: z.ZodObject<{
    userId: z.ZodString;
    avatar: z.ZodObject<{
        avatarId: z.ZodString;
        url: z.ZodDefault<z.ZodString>;
        type: z.ZodDefault<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type UpdateAvatarDto = z.infer<typeof UpdateAvatarDto>;
