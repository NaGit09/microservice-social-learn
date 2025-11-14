<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { ref } from 'vue'
import EmojiPicker from '../Common/icon/EmojiPicker.vue'

const commentText = ref('')

const onSelectEmoji = (emoji: { i: string }) => {
  commentText.value += emoji.i
}
</script>
<template>
  <div class="comment-wrapper">
    <div class="comment-input-area">
      <Input
        class="text-gray-500 dark:text-gray-50 border-none shadow-none"
        v-model="commentText"
        type="text"
        placeholder="Thêm bình luận..."
      />
      <EmojiPicker  @selected="onSelectEmoji" />
    </div>
  </div>
</template>

<style scoped></style>
