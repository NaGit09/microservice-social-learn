// src/user/schemas/address.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Address {
  @Prop()
  country: string;

  @Prop()
  province: string;

  @Prop()
  district: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
