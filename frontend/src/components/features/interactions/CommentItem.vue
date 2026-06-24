<script setup lang="ts">
import { getUserInfoApi } from '@/services/api/user.api'
import type { Comment } from '@/types/comment.type'
import type { UserInfo } from '@/types/user.type'
import type { CommentResp } from '@/types/comment.type'
import { computed, onMounted, ref } from 'vue'
import Like from './Like.vue'
import { useCommentStore } from '@/stores/comment.store'
import { storeToRefs } from 'pinia'
import { toast } from 'vue-sonner'

const props = defineProps<{
  comment: Comment
  likes: number
  totalReply: number
  isChild?: boolean
  postAuthorId: string
  postType?: string
  currentUserId: string
}>()

const emit = defineEmits(['selectComment', 'userComment'])
const useComment = useCommentStore()
const { selectComment, getReplyComment, acceptComment } = useComment
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

const handleAcceptAnswer = async () => {
  try {
    const success = await acceptComment(props.comment._id, props.currentUserId)
    if (success) {
      if (props.comment.isAccepted) {
        toast.success('Marked answer as accepted!')
      } else {
        toast.info('Removed accepted answer status.')
      }
    }
  } catch (error: any) {
    console.error('Failed to accept answer:', error)
    toast.error(error.message || 'Error accepting answer')
  }
}

onMounted(async () => {
  userInfo.value = await getUserInfoApi(props.comment.userId)
})
</script>

<template>
  <div class="flex flex-col">
    <div
      class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition relative overflow-hidden"
      :class="{ 'bg-emerald-500/10 border-l-4 border-emerald-500 dark:bg-emerald-950/20': comment.isAccepted }"
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
          <span v-if="comment.isAccepted" class="inline-flex items-center gap-0.5 mr-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
            ✓ Accepted Solution
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
            v-if="props.postType === 'question' && props.currentUserId === props.postAuthorId"
            @click="handleAcceptAnswer"
            class="hover:underline font-semibold"
            :class="comment.isAccepted ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-500'"
          >
            {{ comment.isAccepted ? 'Unaccept' : 'Accept Answer' }}
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
        :post-author-id="props.postAuthorId"
        :post-type="props.postType"
        :current-user-id="props.currentUserId"
        @selectComment="(c) => handleSelectComment(c, userInfo?.username ?? '')"
        @userComment="$emit('userComment', $event)"
      />
    </div>
  </div>
</template>
