import type { FollowUserDto, UnfollowUserDto } from "@/types/follow.type";
import axiosInstance from "../axios.service";

export const FollowUser = async (dto: FollowUserDto) : Promise<boolean> => {
    return axiosInstance.post('/follow', dto);
}

export const UnfollowUser = async (dto: UnfollowUserDto) => {
    return axiosInstance.delete('/follow', { data: dto });
}

export const AcceptFollow = async (followId: string) => {
    return axiosInstance.patch(`/follow/${followId}/accept`);
}

export const RejectFollow = async (followId: string) => {
    return axiosInstance.patch(`/follow/${followId}/reject`);
}

export const getTotalFollowing = async (userId: string) : Promise<number> => {
    return axiosInstance.get(`/follow/${userId}/followings`)
}

export const getTotalFollowers = async (userId: string): Promise<number> => {
    return axiosInstance.get(`/follow/${userId}/followers`)
}