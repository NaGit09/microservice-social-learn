// src/user/schemas/avatar.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({ _id: false })
export class File {
  @Prop({ required: true })
  fileId: string;

  @Prop()
  fileName: string;

  @Prop({ default: '' })
  url: string;

  @Prop({ default: 'image' })
  type: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
