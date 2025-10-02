import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UploadDocument = Upload & Document;

@Schema({ timestamps: true, versionKey: false })
export class Upload {
  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  storedName: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true, index: true })
  userId: string;
}

export const UploadSchema = SchemaFactory.createForClass(Upload);
