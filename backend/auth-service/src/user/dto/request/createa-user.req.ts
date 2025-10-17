import { z } from 'zod';

export const CreateUserDto = z.object({
  username: z.string().min(3, { message: 'Username least 3 character' }),
  userId: z.string().nonempty({ message: 'UserId is not null' }),
  fullname: z.string().nonempty({ message: 'fullname is not empty' }),
});

export type CreateUserDto = z.infer<typeof CreateUserDto>;
