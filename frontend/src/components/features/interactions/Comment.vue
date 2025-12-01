<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-vue-next'
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog'

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
const props = defineProps<{
    totalComment: number
    item: Post
    userId: string
}>()

const CommentStore = useCommentStore()
const { postComment } = storeToRefs(CommentStore)
const { getComment } = CommentStore
onMounted(async () => {
    await getComment(props.item._id)
})
watch(postComment, () => {
})
 </script>

<template>
    <Dialog>
        <DialogTrigger asChild>
            <Button class="shadow-none dark:text-gray-50">
                <span>{{ totalComment }}</span>
                <MessageCircle />
            </Button>
        </DialogTrigger>

        <!-- MODAL INSTAGRAM STYLE -->
        <DialogContent
            class="p-0 max-w-[90vw] lg:max-w-[80vw] xl:max-w-[70vw] h-[80vh] bg-black dark:bg-gray-950 border border-gray-700 overflow-hidden">
            <DialogTitle class="sr-only">Post Details</DialogTitle>
            <DialogDescription class="sr-only">View post details and comments</DialogDescription>
            <div class="flex w-full h-full">
                <!-- LEFT: MEDIA -->
                <div class="flex-1 bg-black flex items-center justify-center">
                    <PostMedia :files="item.files || []" />
                </div>

                <!-- RIGHT: POST INFO -->
                <div class="w-[400px] bg-white dark:bg-gray-900 border-l border-gray-700 flex flex-col">
                    <!-- HEADER -->
                    <div class="p-1">
                        <PostHeader :author-id="item.author" />
                    </div>

                    <!-- CAPTION -->
                    <div class="px-1 py-2 overflow-y-auto flex-none">
                        <PostCaption :caption="item.caption" :user-id="item.author" />
                    </div>
                    <!-- Comment in post -->
                    <div class="p-2 flex-1 overflow-y-auto max-h-[400px] h-[400px]">
                        <template v-if="postComment && postComment.length > 0">
                            <CommentItem :likes="comment.likes" :comment="comment.comment"
                                v-for="comment in postComment" :key="comment.comment._id" />
                        </template>
                        <p v-else class="dark:text-gray-50 w-full h-full flex items-center justify-center">No comment
                        </p>
                    </div>
                    <!-- ACTIONS (like/comment/etc) -->
                    <div class="px-4 py-2 flex-none">
                        <PostFeature :post="item" :user-id="userId" :total-comment="item.totalComment"
                            :total-like="item.totalLike" :is-liked-by-current-user="false" />
                    </div>

                    <!-- COMMENT INPUT -->
                    <div class="px-2">
                        <FastComment :user-id="userId" :post-id="item._id" />
                    </div>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>
