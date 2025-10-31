import Cookies from 'js-cookie'

const defaultOptions: Cookies.CookieAttributes = {
  secure: import.meta.env.NODE_ENV === 'production',
  sameSite: 'Strict',
  path: '/',
}

export class CookieUtils {
  static set(
    key: string,
    value: string | object,
    options?: Cookies.CookieAttributes
  ): void {
    const stringValue =
      typeof value === 'object' ? JSON.stringify(value) : value
    const finalOptions = { ...defaultOptions, ...options }
    Cookies.set(key, stringValue, finalOptions)
  }

  static get(key: string): string | undefined {
    return Cookies.get(key)
  }

  static getObject<T>(key: string): T | null {
    const value = this.get(key)
    if (!value) {
      return null
    }
    try {
      return JSON.parse(value) as T
    } catch (e) {
      console.error(`Lỗi phân tích JSON từ cookie '${key}':`, e)
      return null
    }
  }

  static remove(key: string): void {
    Cookies.remove(key, { path: defaultOptions.path })
  }
}
