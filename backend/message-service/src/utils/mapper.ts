import { CreateMessageDto } from 'src/common/dto/messages/create-message';
import type { File } from 'src/common/schema/file.entity';

export const mapperToMessageDto = (
  convId: string,
  senderId: string,
  content: string,
  file?: File,
): CreateMessageDto => {
  return {
    convId,
    senderId,
    content,
    file,
  };
};
