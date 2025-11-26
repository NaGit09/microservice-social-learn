import type {
  CommentResp,
  CreateComment,
  UpdateComment,
  ReplyComment,
  CommentPagination,
} from '@/types/comment.type'
import axiosInstance from '../axios.service'

export const CreateCommentApi = (dto: CreateComment): Promise<CommentResp> => {
  return axiosInstance.post('/comment', dto)
}

export const GetCommentRootApi = (postId: string): Promise<CommentPagination> => {
  return axiosInstance.get(`/comment/post/${postId}?page=1&limit=10`)
}

export const GetCommentChildApi = (
  commentParentId: string
): Promise<CommentResp[]> => {
  return axiosInstance.get(`/comment/reply/${commentParentId}?page=1&limit=10`)
}

export const UpdateCommentApi = (
  commentId: string,
  dto: UpdateComment
): Promise<CommentResp> => {
  return axiosInstance.put(`/comment/${commentId}`, dto)
}

export const DeleteCommentApi = (commentId: string): Promise<void> => {
  return axiosInstance.delete(`/comment/${commentId}`)
}

export const ReplyCommentApi = (dto: ReplyComment): Promise<CommentResp> => {
  return axiosInstance.post('/comment/reply', dto)
}
