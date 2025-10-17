// src/user/schemas/avatar.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DEFAULT_AVATAR_URL } from '../constant/constants';
@Schema({ _id: false })
export class File {
  @Prop({ required: true })
  fileId: string;

  @Prop()
  fileName: string;

  @Prop({ default: DEFAULT_AVATAR_URL || '' })
  url: string;

  @Prop({ default: 'image' })
  type: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
