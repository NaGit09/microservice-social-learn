// src/user/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Avatar, AvatarSchema } from './avatar.schema';
import { Address, AddressSchema } from './address.schema';
import { Profile, ProfileSchema } from './profile.schema';
import { DEFAULT_AVATAR_URL } from '../config/constants';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, _id: true }) _id: string;
  @Prop({ unique: true, required: true, index: true })
  username: string;

  @Prop({ default: '' })
  bio: string;

  @Prop({ type: AddressSchema, default: () => ({}) })
  address: Address;

  @Prop({ type: ProfileSchema, default: () => ({}) })
  profile: Profile;

  @Prop({
    type: AvatarSchema,
    default: () => ({ avatarId: null, url: DEFAULT_AVATAR_URL, type: 'image' }),
  })
  avatar: Avatar;
}

export const UserSchema = SchemaFactory.createForClass(User);
