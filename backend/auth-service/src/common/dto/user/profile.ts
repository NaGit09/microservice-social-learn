// src/user/dto/update-profile.dto.ts
import { z } from 'zod';

export const UpdateProfileDtoSchema = z.object({
  userId: z.string().nonempty({ message: 'UserId is not null' }),
  school: z.string().optional(),
  major: z.string().optional(),
  class: z.string().optional(),
  year: z.number().optional(),
  hobbies: z.array(z.string()).optional(),
  hometown: z.string().optional(),
});

export type UpdateProfileDto = z.infer<typeof UpdateProfileDtoSchema>;
