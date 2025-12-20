<script setup lang="ts">
import { useUserStore } from '@/stores/user.store'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { SidebarProvider } from '@/components/ui/sidebar'
import Sidebar from '@/components/common/sidebar/Sidebar.vue'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import Follow from '@/components/features/interactions/Follow.vue'
import { CookieUtils } from '@/utils/cookie.util'
import { Sun, Moon } from 'lucide-vue-next'

const userStore = useUserStore()
const { userRecommend, ownerInfo } = storeToRefs(userStore)
const { recommend } = userStore
const router = useRouter()
const isLoading = ref(false)

// Track follow status locally: userId -> status string
const userStatuses = ref<Record<string, string>>({})

const userId = CookieUtils.get('userId') as string
const selectedTheme = ref<'light' | 'dark'>('light')

const fetchSuggestions = async () => {
  isLoading.value = true
  try {
    if (ownerInfo.value?.id) {
      await recommend(ownerInfo.value.id, 20)
      // Initialize statuses
      userRecommend.value.forEach(u => {
        userStatuses.value[u.id] = 'follow'
      })
    }
  } catch (error) {
    console.error("Failed to fetch recommendations", error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchSuggestions()
})

watch(selectedTheme, () => {
  fetchSuggestions()
})

// Update status when follow action succeeds
const handleFollowSuccess = (targetId: string, newStatus: string) => {
  userStatuses.value[targetId] = newStatus
}

const handleNavigate = (targetUserId: string) => {
  router.push(`/profile/${targetUserId}`)
}

// Watch for changes in userRecommend if it updates from elsewhere
watch(userRecommend, (newVal) => {
  newVal.forEach(u => {
    if (!userStatuses.value[u.id]) {
      userStatuses.value[u.id] = 'follow'
    }
  })
}, { deep: true })
</script>

<template>
  <SidebarProvider class="flex min-h-screen bg-gray-50 dark:bg-black/95"
    style="--sidebar-width: 15rem; --sidebar-width-mobile: 20rem">
    <Sidebar />
    <main class="flex-1 text-gray-900 dark:text-gray-100 flex flex-col h-screen overflow-hidden">
      <!-- Header -->
      <div
        class="md:p-8 pb-4 border-b border-gray-200 dark:border-gray-800/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1
            class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent">
            Connect with People
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-2">Discover people who share your interests.</p>
        </div>

      </div>

      <!-- Content Area -->
      <div class="flex-1 overflow-y-auto p-6 md:p-8">

        <!-- Loading State -->
        <div v-if="isLoading"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <div v-for="i in 8" :key="i"
            class="flex flex-col items-center p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 space-y-4">
            <Skeleton class="h-24 w-24 rounded-full" />
            <div class="space-y-2 w-full flex flex-col items-center">
              <Skeleton class="h-4 w-3/4" />
              <Skeleton class="h-3 w-1/2" />
            </div>
            <Skeleton class="h-10 w-full rounded-lg mt-4" />
          </div>
        </div>

        <!-- Data State -->
        <div v-else-if="userRecommend && userRecommend.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <div v-for="user in userRecommend" :key="user.id"
            class="group relative flex flex-col items-center p-6 bg-white/80 dark:bg-gray-900/40 backdrop-blur-md border border-gray-200 dark:border-gray-800/60 rounded-xl transition-all duration-300 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 overflow-hidden">
            <!-- Background Decoration -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <!-- Avatar -->
            <div class="relative mb-4 cursor-pointer" @click="handleNavigate(user.id)">
              <div
                class="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-75 blur transition-opacity duration-300" />
              <Avatar
                class="relative h-24 w-24 border-2 border-gray-100 dark:border-gray-800 group-hover:border-transparent transition-colors duration-300 bg-white dark:bg-gray-900">
                <AvatarImage :src="user.avatar?.url" class="object-cover" />
                <AvatarFallback
                  class="bg-gray-100 dark:bg-gray-800 text-xl font-semibold text-gray-500 dark:text-gray-400">
                  {{ user.fullname?.substring(0, 2).toUpperCase() || 'UN' }}
                </AvatarFallback>
              </Avatar>
            </div>

            <!-- User Info -->
            <div class="text-center w-full mb-6 cursor-pointer" @click="handleNavigate(user.id)">
              <h3
                class="font-bold text-lg text-gray-900 dark:text-gray-100 truncate w-full px-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                {{ user.fullname }}
              </h3>
              <p class="text-sm text-gray-500 truncate w-full px-4">
                @{{ user.username }}
              </p>

              <!-- Compatibility Badge -->
              <div
                class="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 text-xs">
                <span class="text-gray-500 dark:text-gray-400">Match</span>
                <span class="font-bold text-green-600 dark:text-green-400">{{ Math.round((user.compatibility || 0) *
                  100) }}%</span>
              </div>
            </div>

            <!-- Action -->
            <div class="w-full mt-auto relative z-10">
              <Follow :target-id="user.id" :request-id="userId" :status="userStatuses[user.id] || 'follow'" id=""
                class="w-full" @success="handleFollowSuccess(user.id, $event)" />
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="flex flex-col items-center justify-center h-full py-20 text-center space-y-4">
          <div class="p-6 rounded-full bg-gray-100 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 dark:text-gray-600" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300">No suggestions yet</h3>
          <p class="text-gray-500 max-w-sm">
            We're still getting to know you. Interact with more posts to get better recommendations.
          </p>
        </div>
      </div>
    </main>
  </SidebarProvider>
</template>

<style scoped>
/* Optional: Custom scrollbar styling if needed, otherwise relying on global or browser defaults */
</style>
