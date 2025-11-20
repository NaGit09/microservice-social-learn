import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { NotificationType } from '../enums/notification.type';
import { EntityType } from '../enums/entity.type';
import { User } from './user.entity';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Notification {
  @Prop({
    required: true,
    enum: Object.values(NotificationType),
  })
  type: NotificationType;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  actor: User | string;

  @Prop({ required: true })
  receiver: string;

  @Prop({ enum: Object.values(EntityType), required: false })
  entityType?: EntityType;

  @Prop({ required: false })
  entityId?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop({ default: false })
  isRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
