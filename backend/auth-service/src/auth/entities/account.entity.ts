import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// Create type
export type AccountDocument = Account & Document;
// Create schema
@Schema({ timestamps: true })
export class Account {
  @Prop({ unique: true })
  username: string;
  @Prop({ unique: true })
  email: string;
  @Prop({ length: 8 })
  password: string;
  @Prop({ default: true })
  isActive: boolean;
  @Prop({ default: 'USER' })
  role: string;
  @Prop({ default: [] })
  permissions: string[];
  @Prop()
  refreshToken?: string;
}
// Create schema factory
export const AccountSchema = SchemaFactory.createForClass(Account);
