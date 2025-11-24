<script setup lang="ts">
import Sidebar from '@/components/common/sidebar/Sidebar.vue'
import PostDispay from '@/components/features/feed/PostDispay.vue'
import Recomment from '@/components/features/recommendations/Recomment.vue'
import { SidebarProvider } from '@/components/ui/sidebar'
import { router } from '@/router'
import { useNotificatonStore } from '@/stores/notification.store'
import { usePostStore } from '@/stores/post.store'
import { useUserStore } from '@/stores/user.store'
import { CookieUtils } from '@/utils/cookie.util'
import { storeToRefs } from 'pinia'
import { onMounted, watch } from 'vue'

const postStore = usePostStore()
const { getRandomPost } = postStore
const { ListPost } = storeToRefs(postStore)

const useUser = useUserStore()
const { getOwnInfo  , recommend} = useUser
const { ownerInfo } = useUser

const useNotification = useNotificatonStore();
const { CreateConnection } = useNotification 

onMounted(async () => {
  
  const userId = ownerInfo
    ? ownerInfo.id
    : (CookieUtils.get('userId') as string)
  if (!userId) {
      router.push('/login')
  }

  await recommend(userId)
  await getOwnInfo(userId);
  await getRandomPost();
  await CreateConnection(userId)
})

watch(
  ListPost,
  () => {
    console.log(ListPost.value)
  },
  { deep: true }
)
</script>

<template>
  <SidebarProvider
    class="flex"
    style="--sidebar-width: 15rem; --sidebar-width-mobile: 20rem"
  >
    <Sidebar />
    <main class="flex-1 h-full mt-5 mx-8">
      <div class="flex items-start justify-between overflow-auto">
        <PostDispay :ListPost="ListPost" v-if="ListPost.length > 0" />
        <div v-else class="">Not post !</div>
        <Recomment :userId="ownerInfo?.id || ''" />
      </div>
    </main>
  </SidebarProvider>
</template>

<style></style>
