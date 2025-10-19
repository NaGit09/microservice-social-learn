import { TargetType } from 'src/common/enums/targetType.enum';
import z from 'zod';
export const CreateLikeDto = z.object({
  userReq: z.string(),
  userTarget: z.string(),
  targetId: z.string(),
  TargetType: z
    .enum(Object.values(TargetType) as [string, ...string[]])
    .default(TargetType.POST),
});
export type CreateDtoSchema = z.infer<typeof CreateLikeDto>;
