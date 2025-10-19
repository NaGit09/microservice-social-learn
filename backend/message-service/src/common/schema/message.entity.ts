import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Conversation } from './conversation.entity';
import { React, ReactSchema } from './react.entity';
import { File, FileSchema } from './file.entity';
import { MessageStatus } from '../enums/message.enum';

export type MessageDocument = HydratedDocument<Message>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Message {
    
  _id: mongoose.Schema.Types.ObjectId;
  
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    index: true,
  })
  convId: Conversation;

  @Prop({ required: true, index: true })
  senderId: string;

  @Prop({ trim: true })
  content: string;

  @Prop({ type: FileSchema, required: false, default: null })
  file?: File;

  @Prop({ type: [ReactSchema], default: [] })
  reacts: React[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null })
  reply: Message;

  @Prop({ type: [String], default: [] })
  readBy: string[];

  @Prop({ type: Boolean, default: false })
  isForward: boolean;

  @Prop({
    type: String,
    enum: MessageStatus,
    default: MessageStatus.SENT,
  })
  status: MessageStatus;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.index({ convId: 1, createdAt: -1 });
