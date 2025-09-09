import { z } from 'zod';
import { UserSchemaZ } from '../zod/user.zod';
export const UpdateInforDto = z.object({
  userId: z.string(),
  user: UserSchemaZ,
});

export type UpdateInforDto = z.infer<typeof UpdateInforDto>;
