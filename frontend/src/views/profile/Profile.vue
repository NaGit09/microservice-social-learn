<script setup lang="ts">
import AuthFooter from '@/components/customs/Auth/AuthFooter.vue'
import Sidebar from '@/components/customs/Common/sidebar/Sidebar.vue'
import ProfileContent from '@/components/customs/Profile/ProfileContent.vue'
import ProfileHeader from '@/components/customs/Profile/ProfileHeader.vue'
import ProfilePost from '@/components/customs/Profile/ProfilePost.vue'
import { SidebarProvider } from '@/components/ui/sidebar'
import { usePostStore } from '@/stores/post.store'
import { useUserStore } from '@/stores/user.store'
import { CookieUtils } from '@/utils/cookie.util'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'

const postStore = usePostStore()
const { getPostByAuthour } = postStore
const { authorPosts } = storeToRefs(postStore)
const userStore = useUserStore()
const { getProfile, updateProfile ,getOwnInfo} = userStore
const { profile, ownerInfo } = storeToRefs(userStore)
const userId = CookieUtils.get('userId')
onMounted(async () => {
  await getOwnInfo(userId || '')
  await getProfile( userId || '')
  await getPostByAuthour( userId || '')
})
const totalPost = computed(() => {
  return authorPosts.value?.pagination.total
})
const posts = computed(() => {
  return authorPosts.value?.post
})
</script>

<template>
  <SidebarProvider
    class="flex h-screen"
    style="--sidebar-width: 15rem; --sidebar-width-mobile: 20rem"
  >
    <Sidebar />

    <main class="flex-1 mt-5 mx-8 flex flex-col overflow-auto gap-5">
      <div class="flex flex-col items-center justify-center">
        <ProfileHeader
          :total-post="totalPost ?? 0"
          v-if="ownerInfo"
          :owner-info="ownerInfo"
        />
      </div>
      <ProfileContent
        :update-profile="updateProfile"
        v-if="profile"
        :profile="profile!"
      />

      <div class="flex-1">
        <div class="flex flex-col items-center justify-center">
          <ProfilePost :posts="posts" v-if="posts" />
        </div>
      </div>
      <div class="flex flex-col items-center justify-center">
        <AuthFooter />
      </div>
    </main>
  </SidebarProvider>
</template>

<style></style>
