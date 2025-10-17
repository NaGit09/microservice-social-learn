import mongoose, { Document, HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from '../constant/user-role';
import { UserPermission } from '../constant/user-permission';

export type AccountDocument = HydratedDocument<Account>;

@Schema({ timestamps: true })
export class Account {

  _id : mongoose.Schema.Types.ObjectId;

  @Prop({ unique: true })
  username: string;

  @Prop()
  fullname: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ length: 8 })
  password: string;

  @Prop({ default: true })
  isActive: boolean;
  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.USER,
  })
  role: string;

  @Prop({ default: [UserPermission.ALL] })
  permissions: UserPermission[];

  @Prop()
  refreshToken?: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
