// src/user/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { File } from './file.entity';

export type UserDocument = HydratedDocument<User>;

@Schema({
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            const { _id, __v, ...rest } = ret;

            return {
                id: _id.toString(),
                ...rest,
            };
        },
    },
})
export class User {
    _id: mongoose.Schema.Types.ObjectId;

    @Prop({ unique: true, required: true })
    username: string;

    @Prop({ required: true })
    fullname: string;

    @Prop({ default: '' })
    bio: string;
    @Prop({ type: Object })
    avatar: File;
}

export const UserSchema = SchemaFactory.createForClass(User);
