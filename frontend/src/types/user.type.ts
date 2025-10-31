import type { File } from "./common/file";

export interface UserInfo {
    id: string;
    username: string;
    fullname: string;
    avatar: File;
}

export interface UpdateBio {
    userId: string;
    bio: string;
}

export interface UpdateAvatar {
    userId: string;
    avatar: File;
}
export interface RecommentUser {
    avatar: File;
    bio: string;
    compatibility: number;
    fullname: string;
    username: string;
    id : string;
}