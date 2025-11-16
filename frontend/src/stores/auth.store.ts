import {
  loginApi,
  logoutApi,
  refreshToken,
  registerApi,
} from '@/services/api/auth.api'
import type {loginReq, registerReq } from '@/types/auth.type'
import { CookieUtils } from '@/utils/cookie.util'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const userId = ref('')
  const register = async (credentials: registerReq) => {
    try {
      const registerResp = await registerApi(credentials)
      if (!registerResp) {
        return false
      }
      return true
    } catch (error) {
      console.log(error);
      
    }
  }
  const login = async (credentials: loginReq) => {
    try {
      const responseData = await loginApi(credentials)
      const oneHour = new Date(new Date().getTime() + 60 * 60 * 1000)
      CookieUtils.set('accessToken', responseData.accessToken, {
        expires: oneHour,
      })
      CookieUtils.set('refreshToken', responseData.refreshToken)
      CookieUtils.set('account', responseData.info, { expires: 7 })
      const { id } = responseData.info
      CookieUtils.set('userId', id)
    } catch (err: any) {
      console.error('Login failed:', err)
      throw err
    }
  }
  const logout = async (userId: string) => {
    try {
      const isSuccess = await logoutApi({ userId: userId as string })
      if (isSuccess) {
        CookieUtils.remove('accessToken')
        CookieUtils.remove('refreshToken')
        CookieUtils.remove('userId')
        CookieUtils.remove('ownerInfo')
        return true
      }
    } catch (error) {
      console.log(error)

      return false
    }
  }
  const refresh = async () => {
    await refreshToken({
      userId: userId.value,
    })
  }
  return {
    userId,
    logout,
    register,
    login,
    refresh,
  }
})
