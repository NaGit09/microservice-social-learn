import { z } from 'zod';


export const ShareDtoSchema = z.object({
  actorId: z.string(),
  receiverId: z.string(),
  entityId: z.string(),
  entityTitle: z.string(),
});

export type ShareDto = z.infer<typeof ShareDtoSchema>;
