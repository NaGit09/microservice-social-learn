import { z } from 'zod';

export const CreateUserDto = z.object({
  username: z.string().min(3, { message: 'Username phải có ít nhất 3 ký tự' }),
  userId: z.string().nonempty({ message: 'UserId không được null' }),
});

export type CreateUserDto = z.infer<typeof CreateUserDto>;
