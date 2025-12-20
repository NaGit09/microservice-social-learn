<script setup lang="ts">
import Sidebar from '@/components/common/sidebar/Sidebar.vue'
import PostDispay from '@/components/features/feed/PostDispay.vue'
import Recomment from '@/components/features/recommendations/Recomment.vue'
import Button from '@/components/ui/button/Button.vue'
import { SidebarProvider } from '@/components/ui/sidebar'
import { router } from '@/router'
import { useNotificatonStore } from '@/stores/notification.store'
import { usePostStore } from '@/stores/post.store'
import { useUserStore } from '@/stores/user.store'
import { CookieUtils } from '@/utils/cookie.util'
import { storeToRefs } from 'pinia'
import { computed, onMounted, watch } from 'vue'
import type { Info } from '@/types/auth.type'

const postStore = usePostStore()
const { getRandomPost } = postStore
const { ListPost } = storeToRefs(postStore)

const useUser = useUserStore()
const { getOwnInfo, recommend } = useUser
const { ownerInfo } = useUser

const useNotification = useNotificatonStore()
const { CreateConnection } = useNotification

const isAdmin = computed(() => {
  const account = CookieUtils.getObject<Info>('account')
  return account?.role === 'ADMIN'
})

onMounted(async () => {
  const userId = ownerInfo
    ? ownerInfo.id
    : (CookieUtils.get('userId') as string)
  if (!userId) {
    router.push('/login')
    return
  }

  await recommend(userId, 5)
  await getOwnInfo(userId)
  await getRandomPost()
  await CreateConnection(userId)
})

watch(ListPost, () => { }, { deep: true })
</script>

<template>
  <SidebarProvider class="flex" style="--sidebar-width: 15rem; --sidebar-width-mobile: 20rem">
    <Sidebar />
    <main class="flex-1 h-full mt-5 mx-8 space-y-5">
      <div class="flex items-start justify-between overflow-auto relative">
        <PostDispay :ListPost="ListPost" v-if="ListPost.length > 0" />
        <div v-else class="text-white flex-center h-screen w-full text-2xl">
          Not post !
        </div>
        <Recomment :userId="ownerInfo?.id || ''" />

        <Button v-if="isAdmin" class="absolute bottom-20 right-10 dark:text-white" variant="outline"
          @click="router.push('/admin')">
          Go to admin</Button>
      </div>
    </main>
  </SidebarProvider>
</template>

<style></style>
