// src/auth/dto/register.dto.ts
import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.email(),
  username: z.string().min(3),
  password: z.string().min(8),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
