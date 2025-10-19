import z from "zod";

export const TokenReqSchema = z.object({
    userId : z.string()
})
export type TokenReq = z.infer<typeof TokenReqSchema>;