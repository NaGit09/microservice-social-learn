import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UploadDocument = Upload & Document;

@Schema({ timestamps: true, versionKey: false })
export class Upload {
  @Prop({ required: true })
  originalName: string; // tên gốc file

  @Prop({ required: true })
  storedName: string; // tên  file luu tren db

  @Prop({ required: true })
  url: string; // public url trả về từ supabase

  @Prop({ required: true })
  type: string; // mimetype, ví dụ: image/png, application/pdf

  @Prop({ required: true })
  size: number; // dung lượng file (bytes)

  @Prop({ required: true, index: true })
  userId: string; // id user đã upload file
}

export const UploadSchema = SchemaFactory.createForClass(Upload);
