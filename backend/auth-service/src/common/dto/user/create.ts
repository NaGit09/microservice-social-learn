import z from "zod";

export const CreateUserDtoSchema = z.object({
  id: z.string(),
  username: z.string(),
  fullname: z.string(),
})
export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;