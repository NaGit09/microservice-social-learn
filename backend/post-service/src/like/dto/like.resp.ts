import z from 'zod';
import { targeType } from '../enums/targetType.enum';
export const CreateLikeDto = z.object({
  userReq: z.string(),
  userTarget: z.string(),
  targetId: z.string(),
  targetType: z
    .enum(Object.values(targeType) as [string, ...string[]])
    .default(targeType.POST),
});
export type CreateDtoSchema = z.infer<typeof CreateLikeDto>;
