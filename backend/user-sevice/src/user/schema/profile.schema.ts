// src/user/schemas/profile.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({ timestamps: true })
export class Profile {
  @Prop({ type: String, _id: true })
  _id: string;

  @Prop({ default: 'Nong Lam University' })
  school: string;

  @Prop({ default: 'information technology' })
  major: string;

  @Prop({ default: 'DH22DTA' })
  className: string;

  @Prop({ default: 1 })
  year: number;

  @Prop()
  hobbies: string[];

  @Prop({ default: 'Ho Chi Minh city' })
  hometown: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
