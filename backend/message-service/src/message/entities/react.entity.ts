// src/schemas/react.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({ _id: false })
export class React {
  @Prop()
  userId: string;
  @Prop()
  reactType: number;
}
export const ReactSchema = SchemaFactory.createForClass(React);
