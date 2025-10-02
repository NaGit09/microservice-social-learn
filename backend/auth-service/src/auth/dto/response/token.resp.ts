import z from 'zod';

export const tokenInfoSchema = z.object({
  accessToken: z.string(),
  refresh_token: z.string(),
});

export type TokenInfo = z.infer<typeof tokenInfoSchema>;
