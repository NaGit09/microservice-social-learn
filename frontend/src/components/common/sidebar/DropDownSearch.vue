<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { Search, X } from 'lucide-vue-next'
import { ref, watch } from 'vue'
import { searchUsersApi } from '@/services/api/user.api'
import type { UserInfo } from '@/types/user.type'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useRouter } from 'vue-router'
import { Input } from '@/components/ui/input'
import { useDebounceFn } from '@vueuse/core'

defineProps<{
  open: boolean
  isMobile: boolean
  handleDropdownTriggerClick: (e: MouseEvent) => void
}>()

const router = useRouter()
const searchQuery = ref('')
const searchResults = ref<UserInfo[]>([])
const isLoading = ref(false)

const handleSearch = useDebounceFn(async (query: string) => {
  if (!query.trim()) {
    searchResults.value = []
    return
  }

  isLoading.value = true
  try {
    const results = await searchUsersApi(query)
    searchResults.value = results
  } catch (error) {
    console.error('Search failed:', error)
  } finally {
    isLoading.value = false
  }
}, 300)

watch(searchQuery, (newQuery) => {
  handleSearch(newQuery)
})

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
}

const navigateToProfile = (userId: string) => {
  router.push(`/profile/${userId}`)
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child @click="handleDropdownTriggerClick">
      <SidebarMenuButton class="border-0 text-xl mb-2 w-[220px] 
        hover:bg-gray-200 dark:hover:bg-gray-600" size="lg">
        <div class="flex items-center justify-between gap-2 w-full dark:text-gray-200">
          <div class="flex aspect-square size-8 items-center justify-center rounded-lg">
            <component :is="Search" class="size-6" />
          </div>
          <div v-if="open" class="grid flex-1 leading-tight text-left">
            <span class="truncate font-thin"> Tìm kiếm </span>
          </div>
        </div>
      </SidebarMenuButton>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-[--reka-dropdown-menu-trigger-width] min-w-90 h-screen rounded-lg 
      ml-5 bg-white dark:bg-black dark:text-gray-200 border-l border-gray-200 dark:border-gray-800" align="start"
      :side="isMobile ? 'bottom' : 'right'" :side-offset="4">
      <div class="p-4 flex flex-col gap-4 h-full">
        <div class="relative">
          <h2 class="text-2xl font-semibold mb-4">Tìm kiếm</h2>
          <div class="relative">
            <Input v-model="searchQuery" placeholder="Tìm kiếm người dùng..."
              class="pl-10 pr-10 bg-gray-100 dark:bg-gray-800 border-none max-w-[240px]" />
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <button v-if="searchQuery" @click="clearSearch"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <X class="h-4 w-4" />
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto">
          <div v-if="isLoading" class="flex justify-center p-4">
            <span class="loading loading-spinner loading-sm"></span>
          </div>

          <div v-else-if="searchResults.length > 0" class="flex flex-col gap-2">
            <div v-for="user in searchResults" :key="user.id" @click="navigateToProfile(user.id)"
              class="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors">
              <Avatar class="h-10 w-10">
                <AvatarImage :src="user.avatar?.url" class="object-cover" />
                <AvatarFallback>{{ user.fullname.substring(0, 2).toUpperCase() }}</AvatarFallback>
              </Avatar>
              <div class="flex flex-col">
                <span class="font-semibold text-sm">{{ user.username }}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ user.fullname }}</span>
              </div>
            </div>
          </div>

          <div v-else-if="searchQuery && !isLoading" class="text-center text-gray-500 mt-4">
            Không tìm thấy kết quả nào.
          </div>
        </div>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
<style></style>
