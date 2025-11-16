import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ProfileDocument = HydratedDocument<Profile>;

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

export class Profile {
  
  _id: mongoose.Schema.Types.ObjectId;

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
