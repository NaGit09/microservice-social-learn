<script setup lang="ts">
import AuthFooter from '@/components/customs/Auth/AuthFooter.vue'
import Sidebar from '@/components/customs/Common/sidebar/Sidebar.vue'
import ProfileContent from '@/components/customs/Profile/ProfileContent.vue'
import ProfileHeader from '@/components/customs/Profile/ProfileHeader.vue'
import ProfilePost from '@/components/customs/Profile/ProfilePost.vue'
import { SidebarProvider } from '@/components/ui/sidebar'
import { usePostStore } from '@/stores/post.store'
import type { UserInfo } from '@/types/user.type'
import { CookieUtils } from '@/utils/cookie.util'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
const ownerInfo = CookieUtils.getObject<UserInfo>('ownerInfo')
const postStore = usePostStore()
const { getPostByAuthour } = postStore
const { authorPosts } = storeToRefs(postStore)

onMounted(() => {
    getPostByAuthour(ownerInfo?.id || '');
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

        <main class="flex-1 mt-5 mx-8 flex flex-col  overflow-auto">

            <div class="flex flex-col items-center justify-center">
                <ProfileHeader :total-post="totalPost" v-if="ownerInfo && totalPost" :owner-info="ownerInfo" />
            </div>

            <div class="flex-1">
                <div class="flex flex-col items-center justify-center">
                    <ProfilePost :posts="posts" v-if="posts" />
                </div>
            </div>
            <ProfileContent/>
            <div class="flex flex-col items-center justify-center">
                <AuthFooter />
            </div>
        </main>
    </SidebarProvider>
</template>

<style></style>
