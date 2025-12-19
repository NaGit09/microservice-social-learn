
import axiosInstance from "../axios.service";

export const getAllUsersApi = (page: number, limit: number) => {
    return axiosInstance.get(`/user/admin?page=${page}&limit=${limit}`);
}

export const deleteUserApi = (id: string) => {
    return axiosInstance.delete(`/user/admin/${id}`);
}

export const getUserStatsApi = () => {
    return axiosInstance.get('/user/admin/stats');
}

// Posts
export const getAllPostsApi = (page: number, limit: number) => {
    return axiosInstance.get(`/post/admin/posts?page=${page}&limit=${limit}`);
}

export const deletePostApi = (id: string) => {
    return axiosInstance.delete(`/post/admin/post/${id}`);
}

export const getPostStatsApi = () => {
    return axiosInstance.get('/post/admin/stats');
}

// Comments
export const getAllCommentsApi = (page: number, limit: number) => {
    return axiosInstance.get(`/post/admin/comments?page=${page}&limit=${limit}`);
}

export const deleteCommentApi = (id: string) => {
    return axiosInstance.delete(`/post/admin/comment/${id}`);
}
