import type { File } from "./common/file";
import type { Pagination } from "./common/pagination";

export interface CreateComment {
    userId: string,
    postId: string,
    content: string,
    tag: string | '',
    file : File | null
}
export interface CommentPagination {
    comments : CommentResp[],
    pagination : Pagination
}
export interface Comment {
    _id : string,
    userId: string,
    postId: string,
    content: string,
    tag: string,
    file: File,
    isEdit: boolean,
    isRoot: boolean,
    reply: CommentResp,
    updatedAt : Date

}
export interface CommentResp {
    comment: Comment,
    likes: number,
    replies : number,
}
export interface UpdateComment {
    commentId : string,
    content: string,
    tag: string | '',
    file : File | null
}
export interface ReplyComment {
    userId: string,
    postId: string,
    content: string,
    reply: string,
    file : File | null
}
export interface CommentDetail {
    id: string,
    postId: string,
    userId: string,
    content: string,
    tag: string,
    isEdit: boolean,
    isRoot: boolean,
    file: File,
    createdAt: Date,
    updatedAt: Date,
    reply: CommentResp,
}