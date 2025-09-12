import { Document } from 'mongoose';
import { Avatar } from './avatar.schema';
import { Address } from './address.schema';
import { Profile } from './profile.schema';
export type UserDocument = User & Document;
export declare class User {
    username: string;
    bio: string;
    address: Address;
    profile: Profile;
    avatar: Avatar;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
