import {
  getParticipantsApi,
  getProfileApi,
  getUserInfoApi,
  recommendUserApi,
  recommendSemanticUserApi,
  updateRecommendEmbeddingApi,
  updateAvatarApi,
  updateProfileApi,
} from '@/services/api/user.api'
import type {
  Profile,
  RecommentUser,
  UpdateAvatar,
  UserInfo,
} from '@/types/user.type'
import { CookieUtils } from '@/utils/cookie.util'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('User', () => {
  const userInfo = ref<UserInfo>()
  const userRecommend = ref<RecommentUser[]>([])
  const ownerInfo = ref<UserInfo>()
  const profile = ref<Profile | null>(null)
  const paticipants = ref<UserInfo[]>([])
  const selectedParticipant = ref<UserInfo | null>(null)
  const getParticipants = async (ids: string[]) => {
    const idsMap = ids.map((id) => id)
    const resp = await getParticipantsApi(idsMap)
    if (resp) {
      paticipants.value = resp
    }
  }
  const getUserInfo = async (userId: string) => {
    const info = await getUserInfoApi(userId)
    userInfo.value = info
    CookieUtils.set('userInfo', userInfo.value)
  }

  const getOwnInfo = async (userId: string) => {
    const info = await getUserInfoApi(userId)
    ownerInfo.value = info
    CookieUtils.set('ownerInfo', ownerInfo.value)
  }
  const recommend = async (userId: string, topK: number, type: 'tfidf' | 'semantic' = 'tfidf') => {
    const api = type === 'semantic' ? recommendSemanticUserApi : recommendUserApi
    const recommendResp = await api(userId, topK)
    userRecommend.value = recommendResp
  }
  const updateAvatar = async (dto: UpdateAvatar) => {
    const resp = await updateAvatarApi(dto)
    if (resp && ownerInfo.value) {
      ownerInfo.value.avatar = resp
      await getOwnInfo(dto.userId)
    }
  }
  const getProfile = async (userId: string) => {
    const resp = await getProfileApi(userId)
    if (resp) {
      profile.value = resp
    }
  }
  const updateProfile = async (dto: Profile) => {
    const resp = await updateProfileApi(dto)
    console.log(resp)
    profile.value = resp
    if (dto.id) {
      updateRecommendEmbeddingApi(dto.id).catch((err) => {
        console.error('Failed to update recommendation embedding:', err)
      })
    }
  }
  const setSelectedParticipant = (participant: UserInfo | null | undefined) => {
    selectedParticipant.value = participant || null
  }
  return {
    userInfo,
    userRecommend,
    ownerInfo,
    profile,
    paticipants,
    selectedParticipant,
    recommend,
    getOwnInfo,
    updateAvatar,
    getProfile,
    updateProfile,
    getUserInfo,
    getParticipants,
    setSelectedParticipant,
  }
})
