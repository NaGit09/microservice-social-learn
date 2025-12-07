import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { randomPost, getPostByIdApi, createPostApi, getPostAuthor } from "@/services/api/post.api"
import type { PostPagination, CreatePost, Post } from '@/types/post.type'

export const usePostStore = defineStore('Post', () => {
  const ListPost = ref<Post[]>([])
  const currentPost = ref<Post | undefined>(undefined)
  const totalPosts = computed(() => ListPost.value.length)
  const authorPosts = ref<PostPagination>()

  async function getRandomPost() {
    try {
      const posts = await randomPost()
      ListPost.value = posts
    } catch (error) {
      console.error('Lỗi khi lấy random post:', error)
      throw error
    }
  }

  async function loadMorePosts() {
    try {
      const posts = await randomPost()
      // Filter out duplicates if necessary, or just append
      // Assuming randomPost returns unique enough posts or duplicates are acceptable for now
      ListPost.value.push(...posts)
    } catch (error) {
      console.error('Error loading more posts:', error)
      throw error
    }
  }

  async function getPostById(id: string) {
    try {
      const postGet = await getPostByIdApi(id);
      currentPost.value = postGet;
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async function createPost(dto: CreatePost) {
    try {
      const newPostResult = await createPostApi(dto);

      if (newPostResult) {
        currentPost.value = newPostResult;
        ListPost.value.unshift(newPostResult);
      }

    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async function getPostByAuthour(authorId: string) {
    try {
      const resp = await getPostAuthor(authorId, 1, 6);
      if (resp) {
        authorPosts.value = resp;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  return {
    ListPost,
    currentPost,
    totalPosts,
    authorPosts,
    getPostByAuthour,
    createPost,
    getPostById,
    getRandomPost,
    loadMorePosts
  }
})