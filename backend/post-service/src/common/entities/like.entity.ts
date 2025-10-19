import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { TargetType } from '../enums/targetType.enum';

export type LikeDocument = HydratedDocument<Like>;

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
export class Like {

  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  targetId: string;

  @Prop({ default: TargetType.POST })
  targetType: TargetType;
}
export const LikeSchema = SchemaFactory.createForClass(Like);

LikeSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true });
LikeSchema.index({ targetId: 1, targetType: 1 });