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
  <div class="flex items-center justify-between mx-2">
    <div class="flex gap-2">
      <Like target-type="post" :target-id="post._id" :totalLike="post.totalLike"
        :is-initially-liked="isLikedByCurrentUser || false" />
      <Comment :item="post" :userId="userId" :total-comment="totalComment || 0" />
      <Share />
    </div>
    <div class="flex items-center justify-center dark:text-gray-50">
      <Button class="shadow-none">
        <BookHeart />
      </Button>
    </div>
  </div>
</template>
<style></style>
