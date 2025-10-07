import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Message } from './message.entity';
import { HydratedDocument } from 'mongoose';

export type ConverstaionDocument = HydratedDocument<converstaion>;

@Schema({ timestamps: true })
export class converstaion {
  @Prop()
  name: string;
  @Prop()
  members: string[];
  @Prop()
  lastMessage: Message;
}
export const ConversationSchema = SchemaFactory.createForClass(converstaion);
