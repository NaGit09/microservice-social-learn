import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { randomPost, getPostByIdApi, createPostApi } from "@/services/api/post.api"
import type { CreatePost, Post } from '@/types/post.type'

export const usePostStore = defineStore('Post', () => {
  // === State ===
  const ListPost = ref<Post[]>([])
  const currentPost = ref<Post | undefined>(undefined) // <-- Đổi tên và export
  const totalPosts = computed(() => ListPost.value.length)

  // === Actions ===

  /**
   * Lấy danh sách post ngẫu nhiên và ghi đè vào ListPost
   */
  async function getRandomPost() {
    try {
      const posts = await randomPost()
      ListPost.value = posts
    } catch (error) {
      console.error('Lỗi khi lấy random post:', error)
      throw error // <-- Thêm throw
    }
  }

  /**
   * Lấy một post theo ID và lưu vào currentPost
   */
  async function getPostById(id: string) { // <-- Sửa: Nhận tham số
    try {
      const postGet = await getPostByIdApi(id); // <-- Sửa: Dùng tham số
      currentPost.value = postGet;
    } catch (error) {
      console.log(error)
      throw error // <-- Thêm throw
    }
  }

  /**
   * Tạo một post mới và thêm vào đầu danh sách ListPost
   */
  async function createPost(dto: CreatePost) {
    try {
      const newPostResult = await createPostApi(dto); // <-- Dùng biến cục bộ

      if (newPostResult) {
        currentPost.value = newPostResult; // (Tùy chọn) Cập nhật post đang xem
        ListPost.value.unshift(newPostResult); // Thêm vào đầu danh sách
      }

    } catch (error) {
      console.log(error);
      throw error; // <-- Thêm throw
    }
  }

  return {
    // State
    ListPost,
    currentPost, // <-- Export state này
    totalPosts,

    // Actions
    createPost,
    getPostById, // <-- Sửa tên
    getRandomPost
  }
})