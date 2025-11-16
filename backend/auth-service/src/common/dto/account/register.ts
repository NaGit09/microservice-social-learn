// src/auth/dto/register.dto.ts
import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.email(),
  username: z.string(),
  password: z.string(),
  fullname: z.string() ,
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
