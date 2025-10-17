import z from 'zod';

export const userInfoSchema = z.object({
  id: z.string(),
  username: z.string(),
  fullname: z.string(),
  avatartUrl: z.string(),
});
export type userInfo = z.infer<typeof userInfoSchema>;
