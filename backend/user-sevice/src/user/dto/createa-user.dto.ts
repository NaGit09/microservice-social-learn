// src/user/dto/create-user.dto.ts
import { z } from 'zod';

export const CreateUserDto = z.object({
  username: z.string().min(8, 'Username phải có ít nhất 8 ký tự'),
  userId: z.string('UserId không được null'),
});

export type CreateUserDto = z.infer<typeof CreateUserDto>;
