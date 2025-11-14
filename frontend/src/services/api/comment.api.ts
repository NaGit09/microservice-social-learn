import type { CommentResp, CreateComment } from '@/types/comment.type'
import axiosInstance from '../axios.service'

export const CreateCommentApi = (dto: CreateComment): Promise<CommentResp> => {
  return axiosInstance.post('/comment', dto)
}
