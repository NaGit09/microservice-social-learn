import z from 'zod';
import { targeType } from '../enums/targetType.enum';
export const DeleteLikeDto = z.object({
  userId: z.string(),
  targetId: z.string(),
  targetType: z
    .enum(Object.values(targeType) as [string, ...string[]])
    .default(targeType.POST), // có thể đổi sang enum nếu muốn
});
export type DeleteDtoSchema = z.infer<typeof DeleteLikeDto>;
