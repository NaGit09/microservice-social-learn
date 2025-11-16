<script setup lang="ts">
import { ref } from 'vue'
import EmojiPicker from '../Common/icon/EmojiPicker.vue'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-vue-next'
import { Textarea } from '@/components/ui/textarea'
import { useCommentStore } from '@/stores/comment.store'
import type { CreateComment } from '@/types/comment.type'
import { toast } from 'vue-sonner'

const prop = defineProps<{
  postId: string,
  userId : string
}>()
defineEmits(['increaComment'])
const useComment = useCommentStore();
const { createComment } = useComment;
const commentText = ref('')

const onSelectEmoji = (emoji: { i: string }) => {
  commentText.value += emoji.i
}
const onClick = async () => {
  console.log('click !')
  const dto: CreateComment = {
    postId: prop.postId,
    userId: prop.userId,
    content: commentText.value,
    tag: '',
    file : null
  }
  const resp = await createComment(dto);
  if (!resp) {
    toast.error('Create comment failed !');
  }
  commentText.value = ''
}


</script>
<template>
  <div class="comment-wrapper">
    <div class="comment-input-area">
      <Textarea
        class="text-gray-500 dark:text-gray-50 border-none shadow-none"
        v-model="commentText"
        placeholder="Thêm bình luận..."
      />
      <Button
        class="dark:text-gray-50 shadow-none"
        size="sm"
        :disabled="!commentText"
        @Click="onClick"
        type="submit"
      >
        <Send />
      </Button>
      <EmojiPicker @selected="onSelectEmoji" />
    </div>
  </div>
</template>

<style scoped></style>
