import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { File, FileSchema } from './file.entity';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ 
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      const { _id, __v, ...rest } = ret;

      return {
        id: _id.toString(),
        ...rest
      };
    },
  },
})
export class Comment {

  _id : mongoose.Types.ObjectId;

  @Prop({ required: true})
  postId: string;

  @Prop({ required: true})
  userId: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: String ,default: null})
  tag?: string | null;

  @Prop({ ref: 'Comment' })
  reply?: string;

  @Prop({ default: false })
  isEdit: boolean;

  @Prop({ default: false })
  isRoot: boolean;

  @Prop({ type: FileSchema , default: null })
  file?: File | null;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.index({ postId: 1, isRoot: 1 });
CommentSchema.index({ reply: 1 });