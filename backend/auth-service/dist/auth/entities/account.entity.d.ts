import { Document } from 'mongoose';
export type AccountDocument = Account & Document;
export declare class Account {
    username: string;
    email: string;
    password: string;
    isActive: boolean;
    role: string;
    permissions: string[];
    refreshToken?: string;
}
export declare const AccountSchema: import("mongoose").Schema<Account, import("mongoose").Model<Account, any, any, any, Document<unknown, any, Account, any, {}> & Account & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Account, Document<unknown, {}, import("mongoose").FlatRecord<Account>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Account> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
