<script setup lang="ts">
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { Search, X } from 'lucide-vue-next'
import { ref, watch } from 'vue'
import { searchUsersApi } from '@/services/api/user.api'
import type { UserInfo } from '@/types/user.type'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useRouter } from 'vue-router'
import { Input } from '@/components/ui/input'
import { useDebounceFn } from '@vueuse/core'

const props = defineProps<{
  activePanel: 'search' | 'notifications' | null
  isMobile: boolean
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:activePanel', value: 'search' | 'notifications' | null): void
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

const togglePanel = () => {
  if (props.activePanel === 'search') {
    emit('update:activePanel', null)
  } else {
    emit('update:activePanel', 'search')
  }
}

const closePanel = () => {
  emit('update:activePanel', null)
}

const handleUserClick = (userId: string) => {
  closePanel()
  navigateToProfile(userId)
}
</script>

<template>
  <div class="relative">
    <!-- Trigger Button -->
    <SidebarMenuButton 
      @click="togglePanel"
      class="group border-0 text-xl w-[220px] bg-transparent transition-all duration-300 ease-in-out rounded-xl" 
      size="lg"
      :class="{ 'font-semibold text-primary': activePanel === 'search' }"
    >
      <div class="flex items-center justify-between gap-2 w-full text-zinc-700 dark:text-zinc-300">
        <div class="flex aspect-square size-8 items-center justify-center rounded-lg">
          <Search 
            class="size-6 transition-transform duration-300 group-hover:scale-110"
            :class="{ 'stroke-[2.5px] text-primary': activePanel === 'search' }"
          />
        </div>
        <div :class="[
          'transition-all duration-300 ease-in-out flex-1 leading-tight text-left',
          open ? 'opacity-100 max-w-[200px] translate-x-0 ml-2' : 'opacity-0 max-w-0 -translate-x-4 overflow-hidden pointer-events-none'
        ]">
          <span class="truncate font-normal text-[15px]"> Tìm kiếm </span>
        </div>
      </div>
    </SidebarMenuButton>

    <!-- Backdrop (Mobile only) -->
    <div 
      v-if="isMobile && activePanel === 'search'"
      @click="closePanel"
      class="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
    />
    <!-- Slide-out Panel / Bottom Sheet -->
    <div 
      :class="[
        // Base styles
        'fixed bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-900 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col shadow-2xl z-50',
        // Desktop vs Mobile Layout & Animations
        isMobile 
          ? 'bottom-0 left-0 right-0 h-[75vh] rounded-t-3xl border-t ' + (activePanel === 'search' ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none')
          : 'top-0 bottom-0 left-[55px] w-[397px] border-r rounded-none ' + (activePanel === 'search' ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none')
      ]"
    >
      <div class="p-6 flex flex-col gap-4 h-full pt-8">
        <h2 class="text-2xl font-bold tracking-tight px-1 dark:text-white">Tìm kiếm</h2>
        
        <div class="relative w-full">
          <Input 
            v-model="searchQuery" 
            placeholder="Tìm kiếm"
            class="pl-9 pr-9 bg-zinc-100 dark:bg-zinc-900 border-0 rounded-lg h-9 w-[calc(100%-4rem)] shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus:bg-zinc-200/50 dark:focus:bg-zinc-800/50 text-sm transition-colors" 
          />
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
          <button 
            v-if="searchQuery" 
            @click="clearSearch"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
          >
            <X class="h-3.5 w-3.5" />
          </button>
        </div>

        <!-- Divider -->
        <div class="h-[1px] bg-zinc-100 dark:bg-zinc-900 -mx-6 my-2" />

        <div class="flex-1 overflow-y-auto pr-1">
          <div v-if="isLoading" class="flex justify-center p-8">
            <span class="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></span>
          </div>

          <div v-else-if="searchResults.length > 0" class="flex flex-col gap-1">
            <div 
              v-for="user in searchResults" 
              :key="user.id" 
              @click="handleUserClick(user.id)"
              class="flex items-center gap-3 p-2.5 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 rounded-xl cursor-pointer transition-all duration-200 group/item"
            >
              <Avatar class="h-11 w-11 ring-2 ring-transparent group-hover/item:ring-primary/20 transition-all">
                <AvatarImage :src="user.avatar?.url" class="object-cover" />
                <AvatarFallback class="bg-gradient-to-br from-primary/10 to-indigo-500/10 text-primary dark:text-primary font-bold">
                  {{ user.fullname.substring(0, 2).toUpperCase() }}
                </AvatarFallback>
              </Avatar>
              <div class="flex flex-col flex-1 min-w-0">
                <span class="font-semibold text-sm text-gray-900 dark:text-zinc-100 truncate">{{ user.username }}</span>
                <span class="text-xs text-zinc-400 dark:text-zinc-500 truncate">{{ user.fullname }}</span>
              </div>
            </div>
          </div>

          <div v-else-if="searchQuery && !isLoading" class="text-center text-zinc-400 dark:text-zinc-500 py-8 text-sm">
            Không tìm thấy kết quả nào cho "{{ searchQuery }}".
          </div>
          
          <div v-else class="text-center text-zinc-400 dark:text-zinc-500 py-12 text-sm flex flex-col items-center gap-2.5">
            <Search class="size-8 text-zinc-300 dark:text-zinc-800" />
            <span>Tìm kiếm bạn bè và bạn học</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
