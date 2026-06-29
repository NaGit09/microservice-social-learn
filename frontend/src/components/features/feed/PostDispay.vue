<script setup lang="ts">
import PostHeader from './PostHeader.vue'
import PostFeature from './PostFeature.vue'
import PostCaption from './PostCaption.vue'
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
  <div class="flex items-center justify-center min-h-screen flex-1 p-4 md:p-6 bg-transparent">
    <div class="h-screen overflow-y-auto w-full max-w-[468px] no-scrollbar py-4" @scroll="handleScroll">
      <div class="flex flex-col w-full mb-6 border border-border rounded-2xl relative overflow-hidden bg-card shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 ease-in-out" v-for="item in ListPost"
        :key="String(item._id)">
        
        <!-- Subtle top gradient border for question posts -->
        <div v-if="item.type === 'question'" class="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-primary to-indigo-500" />
        
        <div class="flex justify-between items-center pr-4 pl-1">
          <PostHeader :owner-id="ownerInfo?.id as string" :author-id="item.author" />
          <div v-if="item.type === 'question'" class="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-primary bg-primary/10 rounded-full border border-primary/20 shadow-xs">
            ❓ Question
          </div>
        </div>

        <!-- Post Media -->
        <div class="w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950/40">
          <PostMedia :files="item.files || []" />
        </div>

        <!-- Post Content (Features + Caption) -->
        <div class="flex flex-col gap-2 px-4 pb-3 pt-2">
          <PostFeature :post="item" :total-comment="item.totalComment ?? 0" :total-like="item.totalLike ?? 0"
            :is-liked-by-current-user="false" :userId="ownerInfo?.id as string" />
          <PostCaption :caption="item.caption" :user-id="item.author" />
        </div>
      </div>
    </div>
  </div>
</template>
