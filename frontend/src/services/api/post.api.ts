import axiosInstance from '@/services/axios.service'
import type {
  CreatePost,
  EditPost,
  Post,
  PostPagination,
  SharePost,
} from '@/types/post.type'

export const randomPost = (): Promise<Post[]> => {
  return axiosInstance.get('/post/random/10')
}

export const getPostByIdApi = (id: string): Promise<Post> => {
  return axiosInstance.get(`/post/${id}`)
}

export const getPostAuthor = (
  userId: string,
  page=1,
  size=6
): Promise<PostPagination> => {
  return axiosInstance.get(`/post/user/${userId}?page=${page}&limit=${size}`)
}

export const createPostApi = (dto: CreatePost): Promise<Post> => {
  return axiosInstance.post('/post', dto)
}

export const sharePost = (dto: SharePost): Promise<Post> => {
  return axiosInstance.post('/post/share', dto)
}

export const editPost = (dto: EditPost): Promise<boolean> => {
  return axiosInstance.patch('/post', dto)
}

export const deletePost = (postId: string): Promise<boolean> => {
  return axiosInstance.delete(`/post/${postId}`)
}
