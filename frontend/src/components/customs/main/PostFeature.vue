<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { MessageCircle, Forward, BookHeart } from 'lucide-vue-next'
import Like from '../features/Like.vue'

defineProps({
  postId: String,
})
</script>
<template>
  <div class="flex items-center justify-between mx-2">
    <div class="flex gap-2">
      <Like target-type="post" :target-id="postId" />
      <Button>
        <MessageCircle />
      </Button>
      <Button>
        <Forward />
      </Button>
    </div>
    <div class="flex items-center justify-center">
      <Button>
        <BookHeart />
      </Button>
    </div>
  </div>
</template>
<style></style>
