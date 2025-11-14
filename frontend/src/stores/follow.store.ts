import {
  UnfollowUser,
  FollowUser,
  getTotalFollowers,
  getTotalFollowing,
} from '@/services/api/follow.api'
import { FollowUserDto, UnfollowUserDto } from '@/types/follow.type'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

export const useFollowStore = defineStore('Follow', () => {
  // state
  const totalFollowing = ref(0)
  const totalFollowers = ref(0)

  // getter

  // setter
  const getTotalUserFollowing = async (userId: string) => {
    const totalResp = await getTotalFollowing(userId)
    totalFollowing.value = totalResp
  }

  const getTotalUserFollowers = async (userId: string) => {
    const totalResp = await getTotalFollowers(userId)
    totalFollowers.value = totalResp
  }

  const followUser = async (
    userRequest: string,
    userTarget: string,
    status:     string
  ) => {
    const followReq = new FollowUserDto(userRequest, userTarget, status)
    const apiResp = await FollowUser(followReq)
    if (apiResp) {
      toast('Follow successfully', {
        description: `used follow user  successfully !`,
      })
    }
  }

  const unfollowUser = async (userRequest: string, userTarget: string) => {
    const followReq = new UnfollowUserDto(userRequest, userTarget)
    const apiResp = await UnfollowUser(followReq)
    if (apiResp) {
      toast('Unfollow successfully', {
        description: `used unfollow user  successfully !`,
      })
    }
  }
  return {
    totalFollowers,
    totalFollowing,
    followUser,
    unfollowUser,
    getTotalUserFollowing,
    getTotalUserFollowers,
  }
})
