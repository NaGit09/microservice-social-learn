import { getUserInfo, recommendUser } from '@/services/api/user.api'
import type { RecommentUser, UserInfo } from '@/types/user.type'
import { CookieUtils } from '@/utils/cookie.util'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('User', () => {
  const userInfo = ref<UserInfo>()
  const userRecommend = ref<RecommentUser[]>()
  const ownerInfo = ref<UserInfo>()

  const getOwnInfo = async (userId: string) => {
    const info = await getUserInfo(userId)
    ownerInfo.value = info;
    CookieUtils.set("ownerInfo", ownerInfo.value);
  }
  const recommend = async (userId: string) => {
    const recommendResp = await recommendUser(userId)
    userRecommend.value = recommendResp
  }
  return {
    userInfo,
    userRecommend,
    ownerInfo,
    recommend,
    getOwnInfo
  }
})
