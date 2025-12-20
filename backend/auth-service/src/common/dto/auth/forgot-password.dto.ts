import { z } from 'zod';

export const ForgotPasswordSchema = z.object({
    email: z.string().email(),
});

export type ForgotPasswordDto = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = z.object({
    email: z.string().email(),
    otp: z.string().length(6),
    newPassword: z.string().min(6),
});

export type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>;
