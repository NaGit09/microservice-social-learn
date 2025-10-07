import type { ApiResponse } from '@/types/api'
import { CookieUtils } from '@/utils/cookie.util'
import axios from 'axios'
// define axiosInstance reuse for all api
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor grant token if request authentication
axiosInstance.interceptors.request.use(
  (config) => {
    const token = CookieUtils.get('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
//
axiosInstance.interceptors.response.use(
  (response) => {
    const apiResponse = response.data as ApiResponse<any>

    const isSuccess = apiResponse.statusCode >= 200 && apiResponse.statusCode < 300

    if (isSuccess) {
      return apiResponse.data
    } else {
      return Promise.reject({
        isApiError: true,
        code: apiResponse.statusCode,
        message: apiResponse.message,
      })
    }
  },

  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.warn('Unauthorized! Redirecting to login...')
          CookieUtils.remove('accessToken')
          CookieUtils.remove('user')
          window.location.href = '/login'
          break
      }
    }

    const errorResponse = {
      isApiError: true,
      code: error.response?.status || 500, // Lấy mã HTTP làm mã lỗi
      message:
        error.response?.data?.message || error.message || 'Đã có lỗi xảy ra.',
    }
    return Promise.reject(errorResponse)
  }
)
export default axiosInstance
