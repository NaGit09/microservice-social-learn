<script setup lang="ts">
import { ref, watch } from 'vue'
import EmojiPicker from '../../common/icon/EmojiPicker.vue'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-vue-next'
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
  <div class="comment-wrapper w-full flex flex-col gap-1.5">
    <!-- Quick Emojis (Instagram style) -->
    <div class="flex items-center gap-2.5 px-1 select-none mb-0.5">
      <button 
        v-for="emoji in ['❤️', '🙌', '🔥', '👏', '😢', '😍', '😂']" 
        :key="emoji"
        @click="commentText += emoji"
        type="button"
        class="hover:scale-125 active:scale-90 transition-transform duration-200 cursor-pointer bg-transparent border-none p-0 text-lg"
      >
        {{ emoji }}
      </button>
    </div>
    
    <div class="comment-input-area flex items-center gap-2 bg-zinc-50/50 dark:bg-zinc-900/30 border border-border rounded-xl px-3 py-1 focus-within:ring-2 focus-within:ring-primary/10 focus-within:border-primary/40 transition-all duration-300">
      <EmojiPicker @selected="onSelectEmoji" class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" />
      <textarea
        :id="'comment-textarea-' + postId"
        class="text-zinc-700 dark:text-zinc-200 border-none outline-none focus:outline-none bg-transparent resize-none min-h-0 h-[32px] py-1.5 px-0 flex-1 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-sm leading-5"
        v-model="commentText"
        placeholder="Thêm bình luận..."
        rows="1"
      />
      <Button
        class="h-7 w-7 rounded-full flex items-center justify-center transition-all shadow-none border-none p-0 cursor-pointer"
        :class="commentText ? 'bg-primary hover:bg-primary/95 text-white' : 'bg-transparent text-zinc-300 dark:text-zinc-700'"
        size="sm"
        :disabled="!commentText"
        @Click="onClick"
        type="submit"
      >
        <Send class="h-3.5 w-3.5" />
      </Button>
    </div>
  </div>
</template>

<style scoped>
:deep(textarea) {
  scrollbar-width: none;
  overflow-y: hidden;
}
:deep(textarea::-webkit-scrollbar) {
  display: none;
}
</style>
