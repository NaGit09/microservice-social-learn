<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { BookHeart } from 'lucide-vue-next'
import Like from '../features/Like.vue'
import Comment from '../features/Comment.vue'
import Share from '../features/Share.vue'

defineProps({
  postId: String,
  totalLike: Number,
  totalComment: Number,
  isLikedByCurrentUser : Boolean
})
</script>
<template>
  <div class="flex items-center justify-between mx-2">
    <div class="flex gap-2">
      <Like target-type="post" 
      :target-id="postId" 
      :totalLike="totalLike" 
      :is-initially-liked="isLikedByCurrentUser" />
    <Comment />
    <Share />
  </div>
  <div class="flex items-center justify-center">
    <Button class="shadow-none">
      <BookHeart />
    </Button>
  </div>
  </div>
</template>
<style></style>
