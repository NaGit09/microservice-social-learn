import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { File } from './file.entity';
import { React } from './react.entity';
import { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
  @Prop()
  convId: string;
  @Prop()
  content: string;
  @Prop()
  file: File;
  @Prop()
  reacts: React[];
  @Prop()
  reply: Message;
  @Prop()
  isRead: boolean;
  @Prop()
  isReply: boolean;
  @Prop()
  isForward: boolean;
  @Prop()
  isEdit: boolean;
  @Prop()
  isRecall: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
