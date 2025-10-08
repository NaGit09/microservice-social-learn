import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { File } from './file.entity';
import { React } from './react.entity';
import mongoose, { HydratedDocument } from 'mongoose';
import { Conversation } from './conversation.entity';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    index: true,
  })
  convId: Conversation;

  @Prop({ required: true, index: true })
  senderId: string;

  @Prop({ default: '' })
  content: string;

  @Prop({ type: [File], default: [] })
  file: File[];

  @Prop({ type: [React] })
  reacts: React[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null })
  reply: Message;

  @Prop({ type: [String], default: [] })
  isRead: string[];

  @Prop({ type: Boolean, default: false })
  isReply: boolean;

  @Prop({ type: Boolean, default: false })
  isForward: boolean;

  @Prop({ type: Boolean, default: false })
  isEdit: boolean;

  @Prop({ type: Boolean, default: false })
  isRecall: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
