import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FileType } from '../enums/file.enum';

@Schema({ _id: false })
export class File {
  @Prop({ required: true })
  fileId: string;
  @Prop()
  fileName: string;
  @Prop({ required: true })
  url: string;

  @Prop({ enum: FileType, default: FileType.PDF })
  type: FileType;
}

export const FileSchema = SchemaFactory.createForClass(File);
