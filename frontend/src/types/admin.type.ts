import type { Account } from "./auth.type";
import type { CommentDetail } from "./comment.type";
import type { PostDetail } from "./post.type";

export interface AdminUser {
    id: string;
    username: string;
    fullname: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}
export interface GetAllUser {
    users: Account[];
    meta: metadata;
}
export interface metadata {
    total: number;
    page: number;
    lastPage: number;
}
export interface AdminPost {
    posts: PostDetail[];
    meta: metadata;
}

export interface AdminUserStats {
    totalUsers: number;
    newUsersToday: number;
    monthlyData: number[];
}

export interface AdminPostStats {
    totalPosts: number;
    totalComments: number;
    totalLikes: number;
}
export interface AdminComment {
    comments: CommentDetail[];
    meta: metadata;
}