import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { File, FileSchema } from './file.entity';

export type CommentDocument = Document & Comment;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true, type: Types.ObjectId })
  postId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  userId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop()
  tag?: string;

  @Prop({ type: Types.ObjectId, ref: 'Comment' })
  reply?: Types.ObjectId;

  @Prop({ default: false })
  isEdit: boolean;
  @Prop({ default: false })
  isRoot: boolean;
  @Prop({ type: FileSchema })
  file?: File;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
