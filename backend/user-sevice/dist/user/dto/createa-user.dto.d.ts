import { z } from 'zod';
export declare const CreateUserDto: z.ZodObject<{
    username: z.ZodString;
    userId: z.ZodString;
}, z.core.$strip>;
export type CreateUserDto = z.infer<typeof CreateUserDto>;
