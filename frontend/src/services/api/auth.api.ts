import type {
  auth,
  loginReq,
  logoutReq,
  refreshReq,
  registerReq,
} from '@/types/auth.type'
import axiosInstance from '../axios.service'

export const loginApi = (dto: loginReq): Promise<auth> => {
  return axiosInstance.post('/auth/login', dto)
}

export const registerApi = (dto: registerReq): Promise<boolean> => {
  return axiosInstance.post('/auth/register', dto)
}

export const logoutApi = (dto: logoutReq): Promise<boolean> => {
  return axiosInstance.patch('/auth/logout', dto)
}

export const refreshToken = (dto: refreshReq): Promise<string> => {
  return axiosInstance.patch('/auth/refresh', dto)
}
