import z from 'zod';
import { FileSchema } from 'src/message/entities/file.entity';

export const MessageDtoSchema = z
  .object({
    convId: z.string(),

    content: z.string().trim().optional(),

    file: z.object(FileSchema).optional(),

    senderId: z.string(),
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

export type MessageDto = z.infer<typeof MessageDtoSchema>;
