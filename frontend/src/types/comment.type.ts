import type { File } from "./common/file";

export interface CreateComment {
    userId: string,
    postId: string,
    content: string,
    tag: string | '',
    file : File | null
}
export interface CommentResp {
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