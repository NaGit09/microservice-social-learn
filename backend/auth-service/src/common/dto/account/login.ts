import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type LoginDto = z.infer<typeof LoginSchema>;
