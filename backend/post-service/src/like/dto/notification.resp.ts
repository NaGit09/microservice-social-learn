import { z } from 'zod';
const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

export const NotificationSchema = z.object({
  actorId: objectId,
  receiverId: objectId,
  entityId: objectId,
  entitytitle: z.string().min(1, 'Title is required'),
});

export type NotificationResp = z.infer<typeof NotificationSchema>;
