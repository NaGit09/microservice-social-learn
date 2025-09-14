import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FileType } from '../enums/file.enum';

@Schema({ _id: false }) // không tạo _id cho mỗi file
export class File {
  @Prop({ required: true })
  fileId: string; // id từ upload-service

  @Prop({ required: true })
  url: string; // url trả về từ upload-service

  @Prop({ enum: FileType, default: FileType.PDF })
  type: FileType; // loại file
}

export const FileSchema = SchemaFactory.createForClass(File);
