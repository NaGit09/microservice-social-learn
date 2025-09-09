export declare class Avatar {
    avatarId: string;
    url: string;
    type: string;
}
export declare const AvatarSchema: import("mongoose").Schema<Avatar, import("mongoose").Model<Avatar, any, any, any, import("mongoose").Document<unknown, any, Avatar, any, {}> & Avatar & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Avatar, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Avatar>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Avatar> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
