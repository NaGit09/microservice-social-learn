<script setup lang="ts">
import Sidebar from '@/components/customs/Common/sidebar/Sidebar.vue'
import PostDispay from '@/components/customs/main/PostDispay.vue'
import Recomment from '@/components/customs/User/Recomment.vue'
import { SidebarProvider } from '@/components/ui/sidebar'
import { usePostStore } from '@/stores/post.store'
import { useUserStore } from '@/stores/user.store'
import { CookieUtils } from '@/utils/cookie.util'
import { storeToRefs } from 'pinia'
import { onMounted, watch } from 'vue'

const userId = CookieUtils.get('userId') as string
const postStore = usePostStore()
const { getRandomPost } = postStore
const { ListPost } = storeToRefs(postStore)
const { getOwnInfo } = useUserStore()
onMounted(async () => {
  await getOwnInfo(userId)
  await getRandomPost()
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
        <Recomment />
      </div>
    </main>
  </SidebarProvider>
</template>

<style></style>
