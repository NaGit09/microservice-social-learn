import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type LikeDocument = Document & Like;
@Schema({ timestamps: true })
export class Like {
  @Prop()
  userId: string;
  @Prop()
  targetId: string;
  @Prop()
  targetType: string;
}
export const LikeSchema = SchemaFactory.createForClass(Like);
