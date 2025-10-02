import z from 'zod';

export const AuthorInfor = z.object({
  authorId: z.string(),
  caption: z.string(),
});
export type AuthorInforResp = z.infer<typeof AuthorInfor>;
