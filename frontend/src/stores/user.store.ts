import { getProfileApi, getUserInfoApi, recommendUserApi, updateAvatarApi, updateProfileApi } from '@/services/api/user.api'
import type { Profile,  RecommentUser,   UpdateAvatar,  UserInfo } from '@/types/user.type'
import { CookieUtils } from '@/utils/cookie.util'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('User', () => {
  const userInfo = ref<UserInfo>();
  const userRecommend = ref<RecommentUser[]>();
  const ownerInfo = ref<UserInfo>();
  const profile = ref<Profile | null>(null);

  const getUserInfo = async (userId: string) => {
    const info = await getUserInfoApi(userId)
    userInfo.value = info;
    CookieUtils.set("userInfo", userInfo.value);
  }

  const getOwnInfo = async (userId: string) => {
    const info = await getUserInfoApi(userId)
    ownerInfo.value = info;
    CookieUtils.set("ownerInfo", ownerInfo.value);
  }
  const recommend = async (userId: string) => {
    const recommendResp = await recommendUserApi(userId)
    userRecommend.value = recommendResp
  }
  const updateAvatar = async (dto: UpdateAvatar) => {
    const resp = await updateAvatarApi(dto);
    if (resp) {
      await getOwnInfo(dto.userId);
    }
  }
  const getProfile = async (userId: string) => {
    const resp = await getProfileApi(userId);
    if (resp) {
      profile.value = resp;
    }
  }
  const updateProfile = async (dto: Profile) => {
    const resp = await updateProfileApi(dto);
    console.log(resp);
    profile.value = resp;
    
  }
  return {
    userInfo,
    userRecommend,
    ownerInfo,
    profile,
    recommend,
    getOwnInfo,
    updateAvatar,
    getProfile,
    updateProfile,
    getUserInfo
  }
})
