import { z } from 'zod';

// DTO để tạo notification
export const CreateNotificationDto = z.object({
  actorIds: z.array(z.string('Invalid actorId format')), // danh sách userId (UUID)
  targetUserId: z.string('Invalid targetUserId format'), // user nhận notify
  type: z.enum([
    'SHARE_POST',
    'LIKE_POST',
    'FOLLOW',
    'LIKE_COMMENT',
    'REPLY_COMMENT',
  ]),
  content: z.string().min(1, 'Content cannot be empty'),
});

// TypeScript type để dùng trong service
export type CreateNotificationDto = z.infer<typeof CreateNotificationDto>;
