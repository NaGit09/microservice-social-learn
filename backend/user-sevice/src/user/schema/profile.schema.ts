// src/user/schemas/profile.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Profile {
  @Prop()
  school: string;

  @Prop()
  major: string;

  @Prop()
  class: string;

  @Prop()
  year: number;

  @Prop()
  references: string[];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
