import z from 'zod';

export const ProfileDtoSchema = z.object({
  _id: z.string(),
  school: z.string(),
  major: z.string(),
  class: z.string(),
  year: z.number(),
  references: z.array(z.string()),
  hometown: z.string(),
});

export type ProfileDto = z.infer<typeof ProfileDtoSchema>;
