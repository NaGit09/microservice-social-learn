<script setup lang="ts">
import { useUserStore } from '@/stores/user.store'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { SidebarProvider } from '@/components/ui/sidebar'
import Sidebar from '@/components/common/sidebar/Sidebar.vue'

const userStore = useUserStore()
const { userRecommend, ownerInfo } = storeToRefs(userStore)
const { recommend } = userStore
const router = useRouter()

onMounted(async () => {
  if (ownerInfo.value?.id) {
    await recommend(ownerInfo.value.id)
  }
})

const handleNavigate = (userId: string) => {
  router.push(`/profile/${userId}`)
}
</script>

<template>
  <SidebarProvider
    class="flex"
    style="--sidebar-width: 15rem; --sidebar-width-mobile: 20rem"
  >
    <Sidebar />
    <main class="flex items-center dark:text-white flex-1">
      <div
        class="flex items-center justify-center h-full w-full overflow-y-auto p-4"
      >
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-7xl"
        >
          <div
            v-for="user in userRecommend.slice(0, 20)"
            :key="user.id"
            @click="handleNavigate(user.id)"
            class="flex flex-col items-center gap-3 p-4 bg-white dark:bg-gray-800 
            rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer
             border border-gray-100 dark:border-gray-700"
          >
            <Avatar
              class="size-20 border-2 border-gray-100 dark:border-gray-700"
            >
              <AvatarImage :src="user.avatar?.url" class="object-cover" />
              <AvatarFallback>{{
                user.fullname.substring(0, 2).toUpperCase()
              }}</AvatarFallback>
            </Avatar>

            <div class="text-center">
              <h3 class="font-semibold text-lg truncate max-w-[200px]">
                {{ user.fullname }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                @{{ user.username }}
              </p>
            </div>

            <div class="mt-2 w-full">
              <div
                class="flex items-center justify-center gap-2 text-xs text-gray-500 
                bg-gray-100 dark:bg-gray-700 py-1 px-2 rounded-full"
              >
                <span>Compatibility:</span>
                <span class="font-bold text-green-600"
                  >{{ Math.round(user.compatibility * 100) }}%</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </SidebarProvider>
</template>
