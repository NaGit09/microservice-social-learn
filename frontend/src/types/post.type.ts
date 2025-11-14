import type { File } from "./common/file";

import type { Pagination } from "./common/pagination";

export interface Post {
    _id: string;
    author: string;
    caption: string;
    mode: string;
    shares: number;
    sharePost: string;
    files: File[];
    totalLike: number;
    totalComment: number;
}
export interface PostPagination {
    post: Post[];
    pagination: Pagination;
}

export interface CreatePost {
    author: string;
    files: File[];
    caption: string;
    mode: string;
}

export interface SharePost {
    author: string;
    caption: string;
    mode: string;
    isShare: boolean;
    SharePost: string;
}

export interface EditPost {
    postId: string;
    caption: string;
    mode: string;
}