import { z } from 'zod';

export const NotificationSchema = z.object({
  actorId: z.string(),
  receiverId: z.string(),
  entityId: z.string(),
  entitytitle: z.string().min(1, 'Title is required'),
});

export type NotificationResp = z.infer<typeof NotificationSchema>;
