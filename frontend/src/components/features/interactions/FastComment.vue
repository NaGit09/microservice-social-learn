<script setup lang="ts">
import { ref, watch } from 'vue'
import EmojiPicker from '../../common/icon/EmojiPicker.vue'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-vue-next'
import { Textarea } from '@/components/ui/textarea'
import { useCommentStore } from '@/stores/comment.store'
import type { CreateComment, ReplyComment } from '@/types/comment.type'
import { toast } from 'vue-sonner'

const props = defineProps({
  postId: String,
  userId: String,
  replyCommentData: Object,
  replyUsername: String,
})

defineEmits(['increaComment'])

const useComment = useCommentStore()

const { createComment , replyComment } = useComment

const commentText = ref('')

const onSelectEmoji = (emoji: { i: string }) => {
  commentText.value += emoji.i
}

const onClick = async () => {
  const dto: CreateComment = {
    postId: props.postId ?? '',
    userId: props.userId ?? '',
    content: commentText.value,
    tag: props.replyUsername ?? '',
    file: null,
  }
  if (props.replyCommentData) {
    console.log(props.replyCommentData._id);
    
    const dtoReply: ReplyComment = {
      postId: props.postId ?? '',
      userId: props.userId ?? '',
      content: commentText.value,
      reply: props.replyCommentData._id,
      file: null,
    }

    const resp = await replyComment(dtoReply)
    if (!resp) {
      toast.error('Reply comment failed !')
    } else {
      commentText.value = ''
      toast.success('Reply comment success !')
    }
    return
  }
  const resp = await createComment(dto)
  if (!resp) {
    toast.error('Create comment failed !')
  } else {
    commentText.value = ''
    toast.success('Create comment success !')
  }
}

watch(
  () => props.replyUsername,
  (newVal) => {
    if (newVal) {
      commentText.value = `@${newVal} `
    }
  }
)
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
