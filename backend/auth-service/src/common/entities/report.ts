import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Account } from './account';

export type ReportDocument = HydratedDocument<Report>;

@Schema({ timestamps: true })
export class Report {
    _id: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true })
    reporter: Account;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true })
    reportedUser: Account;

    @Prop({ required: true })
    reason: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
