import z from 'zod';

export const ProfileDtoSchema = z.object({
  _id: z.string(),
  school: z.string(),
  major: z.string(),
  className: z.string(),
  year: z.number(),
  hobbies: z.array(z.string()),
  hometown: z.string(),
});

export type ProfileDto = z.infer<typeof ProfileDtoSchema>;
