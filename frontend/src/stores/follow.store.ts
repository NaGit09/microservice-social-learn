import {
  UnfollowUser,
  FollowUser,
  getTotalFollowers,
  getTotalFollowing,
  GetFollowUser,
  AcceptFollow,
  RejectFollow,
} from '@/services/api/follow.api'
import { type FollowData, FollowUserDto, UnfollowUserDto } from '@/types/follow.type'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

export const useFollowStore = defineStore('Follow', () => {
  const totalFollowing = ref(0)
  const totalFollowers = ref(0)
  const follow = ref<FollowData | null>(null)

  const getFollow = async (targetId: string , requestId : string) => {
    const resp = await GetFollowUser(targetId, requestId);
    if (!resp) {
      follow.value = null;
      console.log('not found follow user !');
    }
    else {

      follow.value = resp;
      
    }
    return;
  }

  const acceptFollow = async (followId: string) => {
    const resp = await AcceptFollow(followId);
    if (resp && follow.value) {
      follow.value.status = 'ACCEPTED';
    }
    return;
  }

  const rejectFollow = async (followId: string) => {
    const resp = await RejectFollow(followId);
    if (resp && follow.value) {
      follow.value.status = 'REJECTED';
    }
    return;
  }

  const getTotalUserFollowing = async (userId: string) => {
    const totalResp = await getTotalFollowing(userId)
    totalFollowing.value = totalResp
  }

  const getTotalUserFollowers = async (userId: string) => {
    const totalResp = await getTotalFollowers(userId)
    totalFollowers.value = totalResp
  }

  const followUser = async (
    userTarget: string,
    userRequest: string,
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

  const unfollowUser = async (
    userRequest: string,
    userTarget: string) => {
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
    follow,
    getFollow,
    followUser,
    unfollowUser,
    acceptFollow,
    rejectFollow,
    getTotalUserFollowing,
    getTotalUserFollowers,
  }
})
