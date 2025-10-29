import type { File } from "../file";

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