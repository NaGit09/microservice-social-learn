import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { randomPost, getPostById } from "@/services/api/post.api"
import type { CreatePost, Post } from '@/types/post.type'

export const usePost = defineStore('Post', () => {
  // state
  const ListPost = ref<Post[]>([])
  const newPost = ref<CreatePost>()
  const post = ref<Post>()
  const postId = "";
  const totalPosts = computed(() => ListPost.value.length)

  // getter 
  async function getRandomPost() {
    try {
      const posts = await randomPost()
      ListPost.value = posts
    } catch (error) {
      console.error('Lỗi khi lấy random post:', error)
    }
  }

  async function getPostId() {
    try {
      const postGet = await getPostById(postId);
      post.value = postGet;

    } catch (error) {
      console.log(error)
    }
  }
  // setter 
  return {
    ListPost,
    newPost,
    totalPosts,
    getPostId,
    getRandomPost
  }
})