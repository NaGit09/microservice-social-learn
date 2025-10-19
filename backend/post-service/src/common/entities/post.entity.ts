import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { File, FileSchema } from './file.entity';
import { PostMode } from '../enums/post.enum';

export type PostDocument = HydratedDocument< Post>;

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

export class Post {

  _id : mongoose.Types.ObjectId;

  @Prop({ required: true , ref: 'User' })
  author: string;

  @Prop({ type: [FileSchema], default: [] })
  files: File[];

  @Prop({ default: ''})
  caption: string;

  @Prop({ enum: PostMode, default: PostMode.PUBLIC })
  mode: PostMode;

  @Prop({ default: 0 })
  shares: number;

  @Prop({ default: false })
  isShare: boolean;

  @Prop({ type: String, default: null , ref: 'Post'})
  sharePost: string | null;
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.index({ author: 1 });