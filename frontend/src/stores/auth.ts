import { loginApi, logoutApi } from '@/services/auth/auth.api'
import type { auth , loginReq } from '@/types/auth/auth'
import { CookieUtils } from '@/utils/cookie.util'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: CookieUtils.getObject<auth>('account') || null,

    accessToken: CookieUtils.get('accessToken') || null,

    refreshToken: CookieUtils.get('refreshToken') || null,

    returnUrl: null as string | null,

    isLoading: false,

    error: null as string | null,
  }),


  getters: {
    isLoggedIn: (state): boolean => !!state.accessToken && !!state.user,
    getUserName: (state): string => state.user?.username || 'Guest',
    getUserId : (state) : string => state.user?.id || 'null',
    getFullName : (state) : string => state.user?.fullname || 'guest'
  },

  actions: {
    /**
     * @param {LoginRequest} credentials
     */
    async login(credentials: loginReq) {
      // set status before call api
      this.isLoading = true
      this.error = null
      try {
        // call api
        const responseData = await loginApi(credentials)
        // update state with api response
        this.user = responseData
        this.accessToken = responseData.accessToken
        this.refreshToken = responseData.refreshToken
        // set attribute in cookie
        const oneHour = new Date(new Date().getTime() + 60 * 60 * 1000);
        CookieUtils.set('accessToken', responseData.accessToken, {
          expires: oneHour,
        })
        CookieUtils.set('refreshToken', responseData.refreshToken)
        CookieUtils.set('account', responseData, { expires: 7 })

        // // 4. navigation user
        // router.push(this.returnUrl || '/dashboard')

      } catch (err: any) {
        this.error = err.message
        console.error('Login failed:', err)
        throw err
      } finally {
        this.isLoading = false
      }
    },
    // logout function
   async logout() {
      // Call api 
      await logoutApi({ userId: this.user?.id as string })
      // update state
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      // remove data from cookie
      CookieUtils.remove('accessToken')
      CookieUtils.remove('refreshToken')
      CookieUtils.remove('account')

      //   // 3. Điều hướng về trang đăng nhập
      //   router.push('/login')
    },
    async refresh ()  {
      this.isLoading = true;
      
    }
  },
})
