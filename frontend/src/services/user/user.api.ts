import type { UpdateAvatar, UpdateBio, UserInfo } from "@/types/user/user";
import axiosInstance from "../axios.service";

export const getUserInfo = (userId : string) : Promise<UserInfo> => {
    return axiosInstance.get(`/user/${userId}`);
}
export const updateBio = ( dto : UpdateBio)  : Promise<boolean> => {
    return axiosInstance.patch('/user/bio' , dto);
}
export const updateAvatar = (dto: UpdateAvatar): Promise<boolean> => {
    return axiosInstance.patch('/user/avatar' , dto)
}
