import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { File } from './file.entity';

export type ConverstaionDocument = HydratedDocument<Conversation>;

@Schema({
  timestamps: true,
})
export class Conversation {
  @Prop()
  name: string;

  @Prop({ required: true, index: true })
  participants: string[];

  @Prop({ type: String, ref: 'Message' })
  lastest: string;

  @Prop({ default: 'pending' })
  status: string;

  @Prop({ index: true })
  owner: string;

  @Prop({ required: false })
  file: File;

  // Metadata
  @Prop({ default: '' })
  pin: string;

  @Prop({ default: false })
  isGroup: boolean;

  @Prop({ required: false })
  isBan: string[];
}
export const ConversationSchema = SchemaFactory.createForClass(Conversation);
