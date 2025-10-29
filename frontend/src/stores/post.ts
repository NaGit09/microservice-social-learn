// src/stores/post.ts
import { ref, computed } from 'vue' // Import ref, computed
import { defineStore } from 'pinia'
import { randomPost, getPostById } from "@/services/post/post.api"
import type { CreatePost, Post } from '@/types/post/post'

export const usePost = defineStore('Post', () => {

  const ListPost = ref<Post[]>([])
  const newPost = ref<CreatePost>()
  const post = ref<Post>()
  const postId = "";

  const totalPosts = computed(() => ListPost.value.length)
 
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
  return {
    ListPost,
    newPost,
    totalPosts,
    getPostId,
    getRandomPost
  }
})