import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { File, FileSchema } from 'src/common/schema/file.entity';
import { Message } from './message.entity';
import { ConversationStatus } from '../enums/conversation.enum';

export type ConverstaionDocument = HydratedDocument<Conversation>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Conversation {
  _id: mongoose.Schema.Types.ObjectId;
  @Prop({
    required: function (this: Conversation) {
      return this.isGroup;
    },
    trim: true,
  })
  name: string;

  @Prop({
    type: [String],
    required: true,
    index: true,
  })
  participants: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Message' })
  lastest: Message;

  @Prop({
    type: String,
    enum: ConversationStatus,
    default: ConversationStatus.PENDING,
  })
  status: ConversationStatus;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  owner: string;

  @Prop({ type: FileSchema, required: false })
  file: File;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Message' })
  pin: Message;

  @Prop({ default: false })
  isGroup: boolean;

  @Prop({
    type: [String],
    default: [],
  })
  isBan: string[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

ConversationSchema.index({ participants: 1, updatedAt: -1 });
