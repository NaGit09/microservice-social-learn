// src/user/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Avatar, AvatarSchema } from './avatar.schema';
import { Address, AddressSchema } from './address.schema';
import { Profile, ProfileSchema } from './profile.schema';

export type UserDocument = User & Document;
const defaultUrl =
  'https://ysachocrphmykusczuke.supabase.co/storage/v1/object/sign/image/geatsIX.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80OGNhMDcxNC1kNWYwLTQ5NjctYWNhMi05NjU2ZDhhNDFhYjQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZS9nZWF0c0lYLmpwZWciLCJpYXQiOjE3NTcyMTgzMTUsImV4cCI6MTc4ODc1NDMxNX0.VbY5V_r_aRWxJ0z46kAnYl1IIr564ifoLEK_LVFEJuQ';
@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ default: '' })
  bio: string;

  @Prop({ type: AddressSchema, default: {} })
  address: Address;

  @Prop({ type: ProfileSchema, default: {} })
  profile: Profile;

  @Prop({
    type: AvatarSchema,
    default: { avatarId: '1', url: defaultUrl, type: 'image' },
  })
  avatar: Avatar;
}

export const UserSchema = SchemaFactory.createForClass(User);
