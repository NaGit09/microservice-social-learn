import z from 'zod';
import { FileSchema } from './file-dto';

export const CreateMessageDtoSchema = z
  .object({
    convId: z.string(),

    content: z.string().trim().optional(),

    file: FileSchema.optional(),

    senderId: z.string(),

    replyId: z.string().optional(),
  })
  .refine(
    (data) => {
      const hasContent = data.content && data.content.length > 0;
      const hasFiles = data.file;

      return hasContent || hasFiles;
    },
    {
      message: 'A message must contain either content or at least one file.',
    },
  );

export type CreateMessageDto = z.infer<typeof CreateMessageDtoSchema>;
