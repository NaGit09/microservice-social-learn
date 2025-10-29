import type {
  auth,
  loginReq,
  logoutReq,
  refreshReq,
  registerReq,
} from '@/types/auth/auth'
import axiosInstance from '../axios.service'

// create login api
export const loginApi = (dto: loginReq): Promise<auth> => {
  return axiosInstance.post('/auth/login', dto)
}

// create register api
export const registerApi = (dto: registerReq): Promise<boolean> => {
  return axiosInstance.post('/auth/register', dto)
}

// create logout api
export const logoutApi = (dto: logoutReq): Promise<boolean> => {
  return axiosInstance.patch('/auth/logout', dto)
}

// create refresh token api
export const refreshToken = (dto: refreshReq): Promise<string> => {
  return axiosInstance.patch('/auth/refresh', dto)
}
