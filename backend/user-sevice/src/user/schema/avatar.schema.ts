// src/user/schemas/avatar.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Avatar {
  @Prop({ required: true })
  avatarId: string;

  @Prop({ default: process.env.DEFAULT_AVATAR || '' })
  url: string;

  @Prop({ default: 'image' })
  type: string;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);
