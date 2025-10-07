// src/user/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { File, FileSchema } from './avatar.schema';
import { DEFAULT_AVATAR_URL } from '../config/constants';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, _id: true })
  _id: string;

  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ required: true })
  fullname: string;

  @Prop({ default: '' })
  bio: string;

  @Prop({
    type: FileSchema,
    default: () => ({
      fileId: '123',
      url: DEFAULT_AVATAR_URL,
      type: 'image',
      fileName: '',
    }),
  })
  avatar: File;
}

export const UserSchema = SchemaFactory.createForClass(User);
