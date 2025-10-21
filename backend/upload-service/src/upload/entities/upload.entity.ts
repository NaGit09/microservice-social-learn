import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type UploadDocument = Upload & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, __v, ...rest } = ret;

      return {
        id: _id.toString(),
        ...rest,
      };
    },
  },
})
export class Upload {
  _id: mongoose.Types.ObjectId;

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

  @Prop({ default: true })
  isDraft: boolean;
}

export const UploadSchema = SchemaFactory.createForClass(Upload);
