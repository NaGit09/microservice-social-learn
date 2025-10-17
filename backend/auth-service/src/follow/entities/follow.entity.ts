import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type FollowDocument = Follow & Document;
@Schema({ timestamps: true })
export class Follow {
  @Prop({ required: true })
  requestId: string;
  @Prop({ required: true })
  targetId: string;
  @Prop({ default: 'pending' })
  status: string;
}
export const FollowSchema = SchemaFactory.createForClass(Follow);
