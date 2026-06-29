<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { BookHeart } from 'lucide-vue-next'
import Like from '../../features/interactions/Like.vue'
import Comment from '../../features/interactions/Comment.vue'
import Share from '../../features/interactions/Share.vue'
import type { Post } from '@/types/post.type';

defineProps<{
  totalLike: number,
  totalComment: number,
  isLikedByCurrentUser: boolean,
  post: Post,
  userId: string,
}>()
</script>
<template>
  <div class="flex items-center justify-between w-full py-1">
    <div class="flex items-center gap-1">
      <Like target-type="post" :target-id="post._id" :totalLike="totalLike"
        :is-initially-liked="isLikedByCurrentUser || false" />
      
      <Comment :item="post" :userId="userId" :total-comment="totalComment || 0" />
      
      <Share />
    </div>
    <div class="flex items-center justify-center">
      <Button class="p-2 h-9 w-9 rounded-full hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 text-zinc-500 hover:text-rose-500 dark:hover:text-rose-400 transition-all bg-transparent shadow-none border-none">
        <BookHeart class="h-5 w-5" />
      </Button>
    </div>
  </div>
</template>
<style></style>
