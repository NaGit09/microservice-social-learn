<script setup lang="ts">

import AuthFooter from '@/components/customs/Auth/AuthFooter.vue'
import Sidebar from '@/components/customs/Common/sidebar/Sidebar.vue'
import ProfileContent from '@/components/customs/Profile/ProfileContent.vue'
import ProfileHeader from '@/components/customs/Profile/ProfileHeader.vue'
import ProfilePost from '@/components/customs/Profile/ProfilePost.vue'

import { SidebarProvider } from '@/components/ui/sidebar'
import { useFollowStore } from '@/stores/follow.store'
import { usePostStore } from '@/stores/post.store'
import { useUserStore } from '@/stores/user.store'
import { CookieUtils } from '@/utils/cookie.util'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const postStore = usePostStore()
const { getPostByAuthour } = postStore
const { authorPosts } = storeToRefs(postStore)

const userStore = useUserStore()
const { getProfile, updateProfile ,getUserInfo , getOwnInfo} = userStore
const { profile, userInfo } = storeToRefs(userStore)

const route = useRoute();
const userId = route.params.id as string;
const ownerId = CookieUtils.get('userId') || '';
const useFollow = useFollowStore()
const { totalFollowers, totalFollowing  } = storeToRefs(useFollow)
const { getTotalUserFollowers, getTotalUserFollowing  , getFollow} = useFollow

const checkOwner = computed(() => {
  return userId !== ownerId;
})
 
onMounted(async () => {
  await getTotalUserFollowers( userId || '')
  await getTotalUserFollowing( userId || '')
  await getOwnInfo(ownerId);
  await getUserInfo(userId || '')
  await getProfile( userId || '')
  await getPostByAuthour(userId || '')
  await getFollow( ownerId,userId )
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
        :total-followers="totalFollowers"
        :total-following="totalFollowing"
          :total-post="totalPost ?? 0"
          v-if="userInfo"
           :user-info="userInfo"
        />
      </div>
      <ProfileContent 
      :user-id="ownerId" 
      :check-owner="checkOwner"
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
