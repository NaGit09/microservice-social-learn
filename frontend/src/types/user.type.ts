import type { File } from "./common/file";

export interface UserInfo {
    id: string;
    username: string;
    fullname: string;
    avatar: File;
    bio: string;
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

export interface Profile {
    id: string;
    school: string;
    major: string;
    className: string;
    year: number;
    hobbies: string[];
    hometown: string;
}
