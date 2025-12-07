<script setup lang="ts">
import PostHeader from './PostHeader.vue'
import PostFeature from './PostFeature.vue'
import PostCaption from './PostCaption.vue'
import FastComment from '../../features/interactions/FastComment.vue'
import PostMedia from './PostMedia.vue'
import type { Post } from '@/types/post.type'
import { useUserStore } from '@/stores/user.store'
import { usePostStore } from '@/stores/post.store'
import { storeToRefs } from 'pinia'

defineProps<{
  ListPost: Post[]
}>()
const useUser = useUserStore();
const { ownerInfo } = storeToRefs(useUser)
const postStore = usePostStore();
const { loadMorePosts } = postStore;

const handleScroll = async (event: Event) => {
  const target = event.target as HTMLElement;
  if (target.scrollHeight - target.scrollTop <= target.clientHeight + 50) {
    await loadMorePosts();
  }
};
</script>

<template>
  <div class="flex items-center justify-center h-screen flex-1 mt-5 p-4 ">
    <div class="h-screen overflow-y-auto" @scroll="handleScroll">
      <div class="flex flex-col w-[500px] m-3 gap-2 border-1 border-gray-300 rounded-lg" v-for="item in ListPost"
        :key="String(item._id)">
        <PostHeader :owner-id="ownerInfo?.id as string" :author-id="item.author" />

        <PostMedia :files="item.files || []" />

        <PostCaption :caption="item.caption" :user-id="item.author" />
        <PostFeature :post="item" :total-comment="item.totalComment" :total-like="item.totalLike"
          :is-liked-by-current-user="false" :userId="ownerInfo?.id as string" />
        <FastComment :user-id="ownerInfo?.id as string" :post-id="item._id" />
      </div>
    </div>
  </div>
</template>
