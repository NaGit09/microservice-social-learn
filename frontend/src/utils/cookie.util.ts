/**
 * @fileoverview Tiện ích quản lý Cookie sử dụng thư viện js-cookie.
 * Cung cấp một giao diện tập trung để đọc, ghi, và xóa cookie.
 * Khuyến khích sử dụng file này thay vì gọi Cookies trực tiếp trong các component.
 */

import Cookies from 'js-cookie'

/**
 * Các tùy chọn mặc định cho cookie để tăng cường bảo mật.
 * - secure: true -> Chỉ gửi cookie qua kết nối HTTPS.
 * - sameSite: 'Strict' -> Giảm thiểu rủi ro tấn công CSRF.
 */
const defaultOptions: Cookies.CookieAttributes = {
  secure: import.meta.env.NODE_ENV === 'production',
  sameSite: 'Strict',
  path: '/',
}

/**
 * Lớp tĩnh (static class) để quản lý Cookie.
 * Việc sử dụng lớp tĩnh giúp nhóm các phương thức liên quan với nhau
 * mà không cần phải khởi tạo đối tượng.
 */
export class CookieUtils {
  /**
   * Thiết lập một giá trị cookie.
   * @param {string} key Tên (key) của cookie.
   * @param {string | object} value Giá trị của cookie. Nếu là object, nó sẽ được tự động chuyển thành chuỗi JSON.
   * @param {Cookies.CookieAttributes} [options] Các tùy chọn thêm cho cookie (ví dụ: expires).
   */
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

  /**
   * Lấy giá trị của một cookie.
   * @param {string} key Tên (key) của cookie cần lấy.
   * @returns {string | undefined} Giá trị của cookie hoặc undefined nếu không tồn tại.
   */
  static get(key: string): string | undefined {
    return Cookies.get(key)
  }

  /**
   * Lấy giá trị của một cookie và phân tích nó thành một object.
   * Hữu ích khi bạn lưu một object JSON vào cookie.
   * @template T Kiểu dữ liệu của object mong muốn.
   * @param {string} key Tên (key) của cookie.
   * @returns {T | null} Object đã được phân tích hoặc null nếu cookie không tồn tại hoặc lỗi phân tích.
   */
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

  /**
   * Xóa một cookie.
   * @param {string} key Tên (key) của cookie cần xóa.
   */
  static remove(key: string): void {
    Cookies.remove(key, { path: defaultOptions.path })
  }
}
