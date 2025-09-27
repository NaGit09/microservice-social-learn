// src/user/dto/update-user.dto.ts
import { z } from 'zod';

export const UpdateUserSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  bio: z.string().max(500).optional(),

  address: z
    .object({
      city: z.string().optional(),
      street: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),

  profile: z
    .object({
      fullname: z.string().optional(),
      birthday: z.string().optional(), // bạn có thể dùng z.date().optional() nếu muốn enforce date
      gender: z.enum(['male', 'female', 'other']).optional(),
    })
    .optional(),

  avatar: z
    .object({
      avatarId: z.string().nullable().optional(),
      url: z.url().optional(),
      type: z.enum(['image', 'video']).optional(),
    })
    .optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
