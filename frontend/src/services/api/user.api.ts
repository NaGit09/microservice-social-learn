import type { UpdateAvatar, UpdateBio, UserInfo, RecommentUser, Profile } from "@/types/user.type";
import axiosInstance from "../axios.service";
import type { File } from "@/types/common/file";

export const getUserInfoApi = (userId: string): Promise<UserInfo> => {
    return axiosInstance.get(`/user/${userId}`);
}
export const updateBioApi = (dto: UpdateBio): Promise<boolean> => {
    return axiosInstance.patch('/user/bio', dto);
}
export const updateAvatarApi = (dto: UpdateAvatar): Promise<File> => {
    return axiosInstance.patch('/user/avatar/update', dto);
}
export const recommendUserApi = (userId: string): Promise<RecommentUser[]> => {
    return axiosInstance.get(`/recommend/${userId}`);
}
export const getProfileApi = (userId: string): Promise<Profile> => {
    return axiosInstance.get(`/user/profile/${userId}`)
}
export const updateProfileApi = (dto: Profile): Promise<Profile> => {
    return axiosInstance.put('/user/profile', dto)
}
export const getParticipantsApi = (ids: string[]): Promise<UserInfo[]> => {
    return axiosInstance.get('/user/participants', { params: { ids: ids.join(',') } });
}

export const searchUsersApi = (query: string): Promise<UserInfo[]> => {
    return axiosInstance.get('/user/search', { params: { q: query } });
}