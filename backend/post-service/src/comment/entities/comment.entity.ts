import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { File, FileSchema } from './file.entity';

export type CommentDocument = Document & Comment;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true })
  postId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  tag?: string;

  @Prop({ ref: 'Comment' })
  reply?: string;

  @Prop({ default: false })
  isEdit: boolean;

  @Prop({ default: false })
  isRoot: boolean;

  @Prop({ type: FileSchema })
  file?: File;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
