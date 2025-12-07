<script setup lang="ts">
import { getUserInfoApi } from '@/services/api/user.api'
import type { Comment } from '@/types/comment.type'
import type { UserInfo } from '@/types/user.type'
import type { CommentResp } from '@/types/comment.type'
import { computed, onMounted, ref } from 'vue'
import Like from './Like.vue'
import { useCommentStore } from '@/stores/comment.store'
import { storeToRefs } from 'pinia'

const props = defineProps<{
  comment: Comment
  likes: number
  totalReply: number
  isChild?: boolean
}>()

const emit = defineEmits(['selectComment', 'userComment'])
const useComment = useCommentStore()
const { selectComment, getReplyComment } = useComment
const { replyCommentData } = storeToRefs(useComment)

const userInfo = ref<UserInfo>()

const showReplies = ref(false)
const loadingReplies = ref(false)
const errorReplies = ref<string | null>(null)

const handleSelectComment = (comment: Comment, username: string) => {
  selectComment(comment)
  emit('selectComment', comment)
  emit('userComment', username)
}

const handleViewReplies = async () => {
  showReplies.value = true
  await getReplyComment(props.comment._id)
}

onMounted(async () => {
  userInfo.value = await getUserInfoApi(props.comment.userId)
})
</script>

<template>
  <div class="flex flex-col">
    <div
      class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
    >
      <img
        :src="userInfo?.avatar?.url ?? ''"
        class="w-10 h-10 rounded-full object-cover"
      />

      <div class="flex-1">
        <p class="text-sm leading-snug">
          <span
            class="font-semibold mr-2 hover:underline cursor-pointer dark:text-gray-50"
          >
            {{ userInfo?.username }}
          </span>
          <span class="dark:text-gray-50">{{ comment.content }}</span>
        </p>

        <div
          class="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400"
        >
          <button
            @click="handleSelectComment(comment, userInfo?.username ?? '')"
            class="hover:underline text-gray-500 dark:text-gray-400"
          >
            Reply
          </button>

          <button
            v-if="totalReply > 0 && !props.isChild"
            @click="handleViewReplies"
            class="hover:underline text-gray-500 dark:text-gray-400"
          >
            {{
              showReplies ? 'ẩn bình luận' : `xem thêm ${totalReply} bình luận`
            }}
          </button>
        </div>
      </div>

      <Like
        :total-like="likes"
        :target-id="comment._id"
        target-type="comment"
        :isInitiallyLiked="false"
      />
    </div>

    <div class="ml-14 mt-2 space-y-2" v-if="loadingReplies">
      <p class="text-sm text-gray-400">Đang tải bình luận...</p>
    </div>

    <div v-if="errorReplies" class="ml-14 mt-2 text-red-500">
      {{ errorReplies }}
    </div>

    <div v-if="showReplies" class="ml-14 mt-2">
      <CommentItem
        v-for="rep in replyCommentData"
        :key="rep.comment._id"
        :comment="rep.comment"
        :likes="rep.likes ?? 0"
        :totalReply="rep.replies ?? 0"
        :is-child="true"
        @selectComment="(c) => handleSelectComment(c, userInfo?.username ?? '')"
        @userComment="$emit('userComment', $event)"
      />
    </div>
  </div>
</template>
