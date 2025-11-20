import type { FollowData, FollowUserDto, UnfollowUserDto } from '@/types/follow.type'
import axiosInstance from '../axios.service'

export const FollowUser = async (dto: FollowUserDto)
  : Promise<boolean> => {
  return axiosInstance.post('/follow/create', dto)
}

export const GetFollowUser = async (
  targetId: string,
  requestId: string
): Promise<FollowData> => {
  return axiosInstance.get(`/follow/get/${targetId}/${requestId}`)
}

export const UnfollowUser = async (dto: UnfollowUserDto)
  : Promise<boolean> => {
  return axiosInstance.delete('/follow/delete', { data: dto })
}

export const AcceptFollow = async (followId: string)
  : Promise<boolean> => {
  return axiosInstance.patch(`/follow/${followId}/accept`)
}

export const RejectFollow = async (followId: string)
  : Promise<boolean> => {
  return axiosInstance.patch(`/follow/${followId}/reject`)
}

export const getTotalFollowing = async (userId: string)
  : Promise<number> => {
  return axiosInstance.get(`/follow/${userId}/followings`)
}

export const getTotalFollowers = async (userId: string)
  : Promise<number> => {
  return axiosInstance.get(`/follow/${userId}/followers`)
}
