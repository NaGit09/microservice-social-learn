import z from 'zod';

export const userInfoSchema = z.object({
  username: z.string(),
  userId: z.string(),
  fullname: z.string(),
});

export type UserInfo = z.infer<typeof userInfoSchema>;
