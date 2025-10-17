import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { FollowStatus } from '../constant/follow-status';

export type FollowDocument = HydratedDocument<Follow>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Follow {

  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, ref: 'accounts' })
  requestId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  targetId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: String,
    enum: FollowStatus,
    default: FollowStatus.PENDING,
  })
  status: FollowStatus;
}
export const FollowSchema = SchemaFactory.createForClass(Follow);

FollowSchema.index({ targetId: 1, requestId: 1 }, { unique: true });
