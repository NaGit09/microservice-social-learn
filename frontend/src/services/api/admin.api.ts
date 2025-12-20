
import type { AdminPost, GetAllUser, AdminUserStats, AdminPostStats, AdminComment } from "@/types/admin.type";
import axiosInstance from "../axios.service";

export const getAllUsersApi = (page: number, limit: number): Promise<GetAllUser> => {
    return axiosInstance.get(`/admin?page=${page}&limit=${limit}`);
}

export const deleteUserApi = (id: string): Promise<void> => {
    return axiosInstance.delete(`/admin/${id}`);
}

export const banUserApi = (id: string): Promise<void> => {
    return axiosInstance.patch(`/admin/ban/${id}`);
}

export const unbanUserApi = (id: string): Promise<void> => {
    return axiosInstance.patch(`/admin/unban/${id}`);
}

export const updateUserRoleApi = (id: string, role: string): Promise<void> => {
    return axiosInstance.patch(`/admin/${id}/role`, { role });
}

// Updated to PATCH
export const addPermissionApi = (id: string, permission: string): Promise<void> => {
    return axiosInstance.patch(`/admin/permissions/${id}/${permission}`);
}

export const removePermissionApi = (id: string, permission: string): Promise<void> => {
    return axiosInstance.delete(`/admin/permissions/${id}/${permission}`);
}

export const resetPasswordApi = (userId: string, newPassword: string): Promise<void> => {
    return axiosInstance.patch(`/admin/reset-password`, { userId, newPassword });
}

// Auth Stats
export const getUserStatsApi = (): Promise<AdminUserStats> => {
    return axiosInstance.get('/admin/stats');
}


// Posts
export const getAllPostsApi = (page: number, limit: number): Promise<AdminPost> => {
    return axiosInstance.get(`/post/admin/posts?page=${page}&limit=${limit}`);
}

export const deletePostApi = (id: string) => {
    return axiosInstance.delete(`/post/admin/post/${id}`);
}

export const getPostStatsApi = (): Promise<AdminPostStats> => {
    return axiosInstance.get('/post/admin/stats');
}

// Comments
export const getAllCommentsApi = (page: number, limit: number): Promise<AdminComment> => {
    return axiosInstance.get(`/post/admin/comments?page=${page}&limit=${limit}`);
}

export const deleteCommentApi = (id: string) => {
    return axiosInstance.delete(`/post/admin/comment/${id}`);
}
