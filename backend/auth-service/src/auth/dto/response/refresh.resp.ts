import z from 'zod';

export const refreshTokenSchema = z.object({
  access_token: z.string(),
});

export type RefreshToken = z.infer<typeof refreshTokenSchema>;
