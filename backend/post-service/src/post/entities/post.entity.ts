import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { File, FileSchema } from './file.entity';
import { PostMode } from '../enums/post.enum';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  author: string;

  @Prop({ type: [FileSchema], default: [] })
  files: File[];

  @Prop()
  caption: string;

  @Prop({ enum: PostMode, default: PostMode.PUBLIC })
  mode: PostMode;

  @Prop({ default: 0 })
  shares: number;

  @Prop({ default: false })
  isShare: boolean;

  @Prop({ type: String, default: null })
  sharePost: string | null;
}

export const PostSchema = SchemaFactory.createForClass(Post);
