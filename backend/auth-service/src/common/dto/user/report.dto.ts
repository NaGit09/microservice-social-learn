import { z } from 'zod';

export const ReportUserDtoSchema = z.object({
    reportedUserId: z.string().min(1, "Reported user ID is required"),
    reason: z.string().min(5, "Reason must be at least 5 characters long"),
});

export type ReportUserDto = z.infer<typeof ReportUserDtoSchema>;
