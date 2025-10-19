import { TargetType } from 'src/common/enums/targetType.enum';
import z from 'zod';
export const CreateLikeDtoSchema = z.object({
  userId: z.string(),
  targetId: z.string(),
  targetType: z
    .enum(Object.values(TargetType) as [string, ...string[]])
    .default(TargetType.POST),
});
export type  CreateLikeDto= z.infer<typeof CreateLikeDtoSchema>;
