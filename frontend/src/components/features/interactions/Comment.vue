<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { MessageCircle, Quote } from 'lucide-vue-next'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

import type { Post } from '@/types/post.type'

import PostHeader from '../feed/PostHeader.vue'
import PostMedia from '../feed/PostMedia.vue'
import PostCaption from '../feed/PostCaption.vue'
import PostFeature from '../feed/PostFeature.vue'
import FastComment from './FastComment.vue'
import { useCommentStore } from '@/stores/comment.store'
import { storeToRefs } from 'pinia'
import { onMounted, watch } from 'vue'
import CommentItem from './CommentItem.vue'

const emit = defineEmits(['selectComment', 'userComment'])
const props = withDefaults(defineProps<{
  totalComment: number
  item: Post
  userId: string
  variant?: 'button' | 'text'
}>(), {
  variant: 'button'
})
import { ref } from 'vue'

const replyComment = ref<Comment>()
const replyUsername = ref<string>('')

const CommentStore = useCommentStore()
const { postComment } = storeToRefs(CommentStore)
const { getComment } = CommentStore

const handleSelectComment = (comment: Comment) => {
  replyComment.value = comment
}
const handleSelectUsername = (username: string) => {
  replyUsername.value = username
}
onMounted(async () => {
  await getComment(props.item._id)
})
watch(postComment, () => {})
</script>

<template>
    <Dialog>
        <DialogTrigger asChild>
            <!-- Button Variant (Icon) -->
            <Button v-if="variant === 'button'" class="flex items-center gap-1.5 px-3 py-1.5 h-9 bg-transparent hover:bg-primary/10 dark:hover:bg-primary/10 text-zinc-700 dark:text-zinc-300 rounded-full transition-all duration-200 shadow-none border-none group active:scale-95 cursor-pointer select-none">
                <MessageCircle class="h-[18px] w-[18px] text-zinc-400 dark:text-zinc-500 group-hover:text-primary group-hover:scale-110 transition-all duration-300 ease-out" />
                <span class="text-xs font-semibold text-zinc-600 dark:text-zinc-400 group-hover:text-primary transition-colors">
                    {{ totalComment }}
                </span>
            </Button>

            <!-- Text Variant -->
            <button v-else class="text-xs font-medium text-zinc-450 dark:text-zinc-500 hover:text-primary dark:hover:text-primary transition-colors cursor-pointer bg-transparent border-none p-0 mt-1.5 flex text-left">
                Xem tất cả {{ totalComment }} bình luận
            </button>
        </DialogTrigger>

        <!-- MODAL INSTAGRAM STYLE -->
        <DialogContent
            class="p-0 max-w-[90vw] lg:max-w-[80vw] xl:max-w-[70vw] h-[80vh] bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
            <DialogTitle class="sr-only">Post Details</DialogTitle>
            <DialogDescription class="sr-only">View post details and comments</DialogDescription>
            <div class="flex flex-col lg:flex-row w-full h-full">
                <!-- LEFT: MEDIA -->
                <div class="w-full lg:flex-1 h-[35vh] lg:h-full bg-zinc-50 dark:bg-zinc-950/20 flex items-center justify-center overflow-hidden border-b lg:border-b-0 border-border">
                    <PostMedia 
                        v-if="item.files && item.files.length > 0" 
                        :files="item.files" 
                        height-class="h-full" 
                        object-fit="contain" 
                        class="w-full h-full" 
                    />
                    <div v-else class="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary/5 to-indigo-500/5 text-center relative">
                        <Quote class="size-8 lg:size-12 text-primary opacity-30 mb-2 lg:mb-4 animate-pulse" />
                        <p class="text-sm lg:text-lg font-medium text-zinc-850 dark:text-zinc-200 max-w-[85%] leading-relaxed italic">
                            "{{ item.caption }}"
                        </p>
                    </div>
                </div>

                <!-- RIGHT: POST INFO -->
                <div class="w-full lg:w-[400px] flex-1 lg:h-full bg-card lg:border-l border-border flex flex-col overflow-hidden">
                    <!-- HEADER -->
                    <div class="p-2 border-b border-border">
                        <PostHeader :author-id="item.author" />
                    </div>

                    <!-- CAPTION -->
                    <div class="px-4 py-3 overflow-y-auto flex-none border-b border-border">
                        <PostCaption :caption="item.caption" :user-id="item.author" />
                    </div>
                    <!-- Comment in post -->
                    <div class="p-4 flex-1 overflow-y-auto space-y-4 max-h-2xl">
                        <template v-if="postComment && postComment.length > 0">
                            <CommentItem v-for="comment in postComment" :key="comment.comment._id"
                                :total-reply="comment.replies"
                                :comment="comment.comment"
                                :likes="comment.likes ?? 0"
                                :post-author-id="item.author"
                                :post-type="item.type ?? 'standard'"
                                :current-user-id="userId"
                                @selectComment="handleSelectComment"
                                @userComment="handleSelectUsername" />
                        </template>

                        <p v-else class="text-zinc-400 dark:text-zinc-500 w-full h-full flex items-center justify-center text-sm font-medium">
                            Chưa có bình luận nào
                        </p>
                    </div>

                    <div class="px-4 py-3 bg-zinc-50/20 dark:bg-zinc-950/10 border-t border-border">
                        <FastComment :user-id="userId" :post-id="item._id" :reply-comment-data="replyComment"
                            :reply-username="replyUsername" />
                    </div>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>
