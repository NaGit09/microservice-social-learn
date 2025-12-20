import { z } from 'zod';

export const AdminResetPasswordSchema = z.object({
    userId: z.string(),
    newPassword: z.string().min(6),
});

export type AdminResetPasswordDto = z.infer<typeof AdminResetPasswordSchema>;
