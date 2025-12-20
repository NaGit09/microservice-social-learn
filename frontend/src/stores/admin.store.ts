import type { AdminPostStats, AdminUserStats, metadata } from "@/types/admin.type";
import type { Account } from "@/types/auth.type";
import type { CommentDetail } from "@/types/comment.type";
import type { PostDetail } from "@/types/post.type";
import { defineStore } from "pinia";
import { ref } from "vue";
import {
    getUserStatsApi,
    getPostStatsApi,
    getAllUsersApi,
    getAllPostsApi,
    getAllCommentsApi,
    deleteUserApi,
    banUserApi,
    updateUserRoleApi,
    deletePostApi,
    deleteCommentApi
} from "@/services/api/admin.api";


export const useAdminStore = defineStore('admin', () => {
    // State
    const dashboardStats = ref<AdminUserStats | null>(null)
    const dashboardPostStats = ref<AdminPostStats | null>(null)
    const users = ref<Account[]>([])
    const posts = ref<PostDetail[]>([])
    const comments = ref<CommentDetail[]>([])
    const userMetadata = ref<metadata | null>(null)
    const postMetadata = ref<metadata | null>(null)
    const commentMetadata = ref<metadata | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Actions
    const fetchDashboardStats = async () => {
        loading.value = true
        error.value = null
        try {
            const [userStats, postStats] = await Promise.all([
                getUserStatsApi(),
                getPostStatsApi()
            ])
            dashboardStats.value = userStats
            dashboardPostStats.value = postStats
        } catch (err: any) {
            error.value = err.message || 'Failed to fetch dashboard stats'
            console.error(err)
        } finally {
            loading.value = false
        }
    }

    const fetchUsers = async (page: number, limit: number) => {
        if (loading.value) return; // Prevent concurrent requests
        loading.value = true
        error.value = null
        console.log(`[AdminStore] Fetching users page: ${page}, limit: ${limit}`);
        try {
            const res = await getAllUsersApi(page, limit)
            console.log(`[AdminStore] Received ${res.users.length} users. Metadata:`, res.meta);

            if (page === 1) {
                users.value = res.users
            } else {
                const currentIds = new Set(users.value.map(u => u.id));
                const newUsers = res.users.filter(u => !currentIds.has(u.id));
                if (newUsers.length < res.users.length) {
                    console.warn(`[AdminStore] Filtered out ${res.users.length - newUsers.length} duplicate users.`);
                }
                users.value = [...users.value, ...newUsers]
            }
            userMetadata.value = res.meta
            console.log(`[AdminStore] Total users in store: ${users.value.length}`);
        } catch (err: any) {
            error.value = err.message || 'Failed to fetch users'
            console.error(err)
        } finally {
            loading.value = false
        }
    }

    const fetchPosts = async (page: number, limit: number) => {
        if (loading.value) return;
        loading.value = true
        error.value = null
        console.log(`[AdminStore] Fetching posts page: ${page}`);
        try {
            const res = await getAllPostsApi(page, limit)
            if (page === 1) {
                posts.value = res.posts
            } else {
                const currentIds = new Set(posts.value.map(p => p.id));
                const newPosts = res.posts.filter(p => !currentIds.has(p.id));
                posts.value = [...posts.value, ...newPosts]
            }
            postMetadata.value = res.meta
        } catch (err: any) {
            error.value = err.message || 'Failed to fetch posts'
            console.error(err)
        } finally {
            loading.value = false
        }
    }

    const fetchComments = async (page: number, limit: number) => {
        if (loading.value) return;
        loading.value = true
        error.value = null
        console.log(`[AdminStore] Fetching comments page: ${page}`);
        try {
            const res = await getAllCommentsApi(page, limit)
            if (page === 1) {
                comments.value = res.comments
            } else {
                const currentIds = new Set(comments.value.map(c => c.id));
                const newComments = res.comments.filter(c => !currentIds.has(c.id));
                comments.value = [...comments.value, ...newComments]
            }
            commentMetadata.value = res.meta
        } catch (err: any) {
            error.value = err.message || 'Failed to fetch comments'
            console.error(err)
        } finally {
            loading.value = false
        }
    }

    const deleteUser = async (id: string) => {
        try {
            await deleteUserApi(id)
            users.value = users.value.filter(user => user.id !== id)
        } catch (err: any) {
            throw err
        }
    }

    const banUser = async (id: string) => {
        try {
            await banUserApi(id)
            const user = users.value.find(u => u.id === id)
            if (user) {
                user.isActive = !user.isActive
            }
        } catch (err: any) {
            throw err
        }
    }

    const updateUserRole = async (id: string, role: string) => {
        try {
            await updateUserRoleApi(id, role)
            const user = users.value.find(u => u.id === id)
            if (user) {
                user.role = role
            }
        } catch (err: any) {
            throw err
        }
    }

    const deletePost = async (id: string) => {
        try {
            await deletePostApi(id)
            posts.value = posts.value.filter(post => post.id !== id)
        } catch (err: any) {
            throw err
        }
    }

    const deleteComment = async (id: string) => {
        try {
            await deleteCommentApi(id)
            comments.value = comments.value.filter(comment => comment.id !== id)
        } catch (err: any) {
            throw err
        }
    }

    return {
        dashboardStats,
        dashboardPostStats,
        users,
        posts,
        comments,
        userMetadata,
        postMetadata,
        commentMetadata,
        loading,
        error,
        fetchDashboardStats,
        fetchUsers,
        fetchPosts,
        fetchComments,
        deleteUser,
        banUser,
        updateUserRole,
        deletePost,
        deleteComment
    }
})