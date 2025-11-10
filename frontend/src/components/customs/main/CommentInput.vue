<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Smile } from 'lucide-vue-next'
import { ref } from 'vue'
import EmojiPicker from 'vue3-emoji-picker'
// @ts-ignore - Ignore missing type declarations for emoji picker CSS import
import 'vue3-emoji-picker/css'

const commentText = ref('')

const onSelectEmoji = (emoji: { i: string }) => {
  commentText.value += emoji.i
}
</script>
<template>
  <div class="comment-wrapper">
    <div class="comment-input-area">
      <Input
        class="text-gray-50 border-none"
        v-model="commentText"
        type="text"
        placeholder="Thêm bình luận..."
      />

      <div class="emoji-button-container">
        <Popover>
          <PopoverTrigger as-child>
            <Button class="bg-transparent text-gray-50">
              <Smile />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="bg-gray-950">
            <EmojiPicker theme="dark" :native="true" @select="onSelectEmoji" />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comment-wrapper {
  width: 100%;
  max-width: 500px;
}

.comment-input-area {
  display: flex;
  align-items: center;
  border-radius: 22px;
  padding: 8px 12px;
}

.comment-input-area input {
  flex-grow: 1;
  border: none;
  outline: none;
  background: none;
  font-size: 0.9rem;
}

.emoji-button-container {
  position: relative;
  margin-left: 8px;
}

.emoji-button {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0;
  display: flex;
  align-items: center;
}

.picker-container-right {
  position: absolute;
  z-index: 10;
  left: 100%;
  bottom: 0;
  margin-left: 10px;
}
</style>
