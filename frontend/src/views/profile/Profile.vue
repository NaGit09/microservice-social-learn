<script setup lang="ts">

import AuthFooter from '@/components/features/auth/AuthFooter.vue'
import Sidebar from '@/components/common/sidebar/Sidebar.vue'
import ProfileContent from '@/components/features/profile/ProfileContent.vue'
import ProfileHeader from '@/components/features/profile/ProfileHeader.vue'
import ProfilePost from '@/components/features/profile/ProfilePost.vue'

import { SidebarProvider } from '@/components/ui/sidebar'
import { useFollowStore } from '@/stores/follow.store'
import { usePostStore } from '@/stores/post.store'
import { useUserStore } from '@/stores/user.store'
import { CookieUtils } from '@/utils/cookie.util'
import { storeToRefs } from 'pinia'
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const postStore = usePostStore()
const { getPostByAuthour } = postStore
const { authorPosts } = storeToRefs(postStore)

const userStore = useUserStore()
const { getProfile, updateProfile, getUserInfo, getOwnInfo } = userStore
const { profile, userInfo } = storeToRefs(userStore)

const route = useRoute();
const userId = route.params.id as string;
const ownerId = CookieUtils.get('userId') || '';
const useFollow = useFollowStore()
const { totalFollowers, totalFollowing } = storeToRefs(useFollow)
const { getTotalUserFollowers, getTotalUserFollowing, getFollow } = useFollow

const checkOwner = computed(() => {
  return userId !== ownerId;
})

const loadData = async (id: string) => {
  if (!id) return
  try {
    await Promise.all([
      getTotalUserFollowers(id),
      getTotalUserFollowing(id),
      getOwnInfo(ownerId),
      getUserInfo(id),
      getProfile(id),
      getPostByAuthour(id),
      getFollow(ownerId, id)
    ])
  } catch (error) {
    console.error('Failed to load profile data:', error)
  }
}

onMounted(async () => {
  await loadData(userId)
})

watch(() => route.params.id, async (newId) => {
  if (newId) {
    await loadData(newId as string)
  }
})

const totalPost = computed(() => {
  return authorPosts.value?.pagination.total
})

const posts = computed(() => {
  return authorPosts.value?.post
})

</script>

<template>
  <SidebarProvider class="flex h-screen" style="--sidebar-width: 15rem; --sidebar-width-mobile: 20rem">
    <Sidebar />

    <main class="flex-1 mt-5 mx-8 flex flex-col overflow-auto gap-5">
      <div class="flex flex-col items-center justify-center">
        <ProfileHeader :total-followers="totalFollowers" :total-following="totalFollowing" :total-post="totalPost ?? 0"
          v-if="userInfo" :user-info="userInfo" />
      </div>
      <ProfileContent :user-id="ownerId" :check-owner="checkOwner" :update-profile="updateProfile" v-if="profile"
        :profile="profile!" />

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
