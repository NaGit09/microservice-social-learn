import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type NotificationDocument = Notification & Document;
@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: [{ type: Types.ObjectId }], default: [] })
  actorIds: Types.ObjectId[]; // danh sách userId của những người hành động

  @Prop({ type: Types.ObjectId, required: true })
  targetUserId: Types.ObjectId; // userId của người nhận notify

  @Prop({
    type: String,
    enum: [
      'SHARE_POST',
      'LIKE_POST',
      'FOLLOW',
      'LIKE_COMMENT',
      'REPLY_COMMENT',
    ],
    required: true,
  })
  @Prop({ default: false })
  isRead: boolean;
  @Prop({ default: 'LIKE_POST' })
  type: string;
  @Prop({ default: '' })
  content: string;
}
export const NotificationSchema = SchemaFactory.createForClass(Notification);
