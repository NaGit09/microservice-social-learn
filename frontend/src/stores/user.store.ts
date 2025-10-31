import { getUserInfo, recommendUser } from '@/services/api/user.api'
import type { RecommentUser, UserInfo } from '@/types/user.type'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUser = defineStore('User', () => {
  const userInfo = ref<UserInfo>()
  const userRecommend = ref<RecommentUser[]>()

  const getInfo = async (userId: string) => {
    const info = await getUserInfo(userId)
    userInfo.value = info
  }

  const recommend = async (userId: string) => {
    const recommendResp = await recommendUser(userId)
    userRecommend.value = recommendResp
  }
  return {
    userInfo,
    userRecommend,
    getInfo,
    recommend,
  }
})
