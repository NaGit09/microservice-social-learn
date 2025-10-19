import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class File {
  @Prop({ required: true })
  fileId: string;

  @Prop()
  fileName: string;

  @Prop({ required: true })
  url: string;

  @Prop()
  type: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
