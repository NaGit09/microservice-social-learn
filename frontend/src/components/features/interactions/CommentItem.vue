<script setup lang="ts">
import { getUserInfoApi } from '@/services/api/user.api'
import type { Comment } from '@/types/comment.type'
import type { UserInfo } from '@/types/user.type'
import type { CommentResp } from '@/types/comment.type'
import { onMounted, ref, computed, watch } from 'vue'
import Like from './Like.vue'
import { useCommentStore } from '@/stores/comment.store'
import { storeToRefs } from 'pinia'
import { toast } from 'vue-sonner'
import { MessageSquare, Check, ChevronDown, ChevronUp, Award } from 'lucide-vue-next'

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
const localReplies = ref<CommentResp[]>([])

const avatarUrl = computed(() => {
  return userInfo.value?.avatar?.url || `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${props.comment.userId}`
})

const avatarSrc = ref('')

watch(avatarUrl, (newUrl) => {
  avatarSrc.value = newUrl
}, { immediate: true })

const handleAvatarError = () => {
  avatarSrc.value = `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${props.comment.userId}`
}

const handleSelectComment = (comment: Comment, username: string) => {
  selectComment(comment)
  emit('selectComment', comment)
  emit('userComment', username)
}

const handleViewReplies = async () => {
  if (showReplies.value) {
    showReplies.value = false
    return
  }

  loadingReplies.value = true
  errorReplies.value = null
  try {
    const success = await getReplyComment(props.comment._id)
    if (success && replyCommentData.value) {
      localReplies.value = [...replyCommentData.value]
    }
    showReplies.value = true
  } catch (err: any) {
    errorReplies.value = err.message || 'Không thể tải bình luận'
    toast.error('Không thể tải bình luận phản hồi')
  } finally {
    loadingReplies.value = false
  }
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

// Relative time formatter helper
const formatRelativeTime = (dateInput: Date | string | undefined) => {
  if (!dateInput) return ''
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Vừa xong'
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) return `${diffInMinutes}m`
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h`
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d`

  return date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })
}

onMounted(async () => {
  userInfo.value = await getUserInfoApi(props.comment.userId)
})
</script>

<template>
  <div class="flex flex-col w-full group/item">
    <!-- Main Comment Container -->
    <div
      class="flex items-start gap-3 px-4 py-3 hover:bg-zinc-50/70 dark:hover:bg-zinc-900/30 transition-all duration-350 ease-out relative rounded-xl"
      :class="{
        'bg-emerald-500/[0.03] border-l-2 border-emerald-500 dark:bg-emerald-500/[0.02] shadow-sm shadow-emerald-500/5': comment.isAccepted,
        'pl-3': isChild
      }"
    >
      <!-- Avatar Section with Hover ring -->
      <div class="relative flex-shrink-0">
        <img
          :src="avatarSrc"
          @error="handleAvatarError"
          class="w-8 h-8 rounded-full object-cover ring-2 ring-zinc-100 dark:ring-zinc-800/80 group-hover/item:ring-primary/20 transition-all duration-300 shadow-sm"
          alt="Avatar"
        />
      </div>

      <!-- Comment Content & Actions -->
      <div class="flex-1 min-w-0">
        <!-- Header Info (Username, Role, Time) -->
        <div class="flex flex-wrap items-center gap-1.5 text-xs">
          <span
            class="font-semibold text-zinc-900 dark:text-zinc-100 hover:text-primary cursor-pointer transition-colors"
          >
            {{ userInfo?.username || 'User' }}
          </span>

          <!-- OP (Author) Badge -->
          <span
            v-if="comment.userId === props.postAuthorId"
            class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 select-none"
          >
            Author
          </span>

          <!-- Accepted Solution Badge -->
          <span
            v-if="comment.isAccepted"
            class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50"
          >
            <Check class="w-3 h-3" />
            Chấp nhận
          </span>

          <!-- Separator dot and Time -->
          <span class="text-zinc-400 dark:text-zinc-500 select-none">&middot;</span>
          <span class="text-zinc-400 dark:text-zinc-500 font-normal">
            {{ formatRelativeTime(comment.updatedAt) }}
          </span>
        </div>

        <!-- Comment Text -->
        <div class="mt-1.5 text-sm text-zinc-750 dark:text-zinc-300 leading-relaxed break-words">
          <span v-if="comment.tag" class="text-primary font-semibold mr-1">@{{ comment.tag }}</span>
          {{ comment.content }}
        </div>

        <!-- Attached File/Image -->
        <div
          v-if="comment.file && comment.file.url"
          class="mt-2.5 rounded-lg overflow-hidden border border-zinc-150 dark:border-zinc-800 max-w-xs group/img relative shadow-sm hover:shadow-md transition-all duration-250"
        >
          <img
            :src="comment.file.url"
            class="max-h-48 w-auto object-cover hover:scale-[1.02] transition-transform duration-350 ease-out"
            alt="Attached image"
          />
        </div>

        <!-- Action Toolbar -->
        <div
          class="flex flex-wrap items-center gap-4 mt-2.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium"
        >
          <!-- Reply Button -->
          <button
            @click="handleSelectComment(comment, userInfo?.username ?? '')"
            class="flex items-center bg-transparent border-0  gap-1 hover:text-primary dark:hover:text-primary transition-colors cursor-pointer"
          >
            Phản hồi
          </button>

          <!-- Accept Answer Button (Only visible to Post Owner on Question Posts) -->
          <button
            v-if="props.postType === 'question' && props.currentUserId === props.postAuthorId"
            @click="handleAcceptAnswer"
            class="flex items-center gap-1 transition-colors cursor-pointer font-semibold"
            :class="comment.isAccepted
              ? 'text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400'
              : 'text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400'"
          >
            <Award class="w-3.5 h-3.5" />
            {{ comment.isAccepted ? 'Hủy chấp nhận' : 'Chấp nhận đáp án' }}
          </button>

          <!-- View Replies Toggle -->
          <button
            v-if="totalReply > 0 && !props.isChild"
            @click="handleViewReplies"
            class="flex items-center gap-1 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <component :is="showReplies ? ChevronUp : ChevronDown" class="w-3.5 h-3.5" />
            <span>
              {{ showReplies ? 'Ẩn phản hồi' : `Xem thêm ${totalReply} phản hồi` }}
            </span>
          </button>
        </div>
      </div>

      <!-- Like Button on Right side -->
      <div class="flex-shrink-0 self-start mt-1.5 mr-1">
        <Like
          :total-like="likes"
          :target-id="comment._id"
          target-type="comment"
          :isInitiallyLiked="false"
          variant="text"
        />
      </div>
    </div>

    <!-- Skeleton Loader for Replies -->
    <div class="ml-10 mt-2 pl-4 border-l border-zinc-150 dark:border-zinc-800/80 space-y-3" v-if="loadingReplies">
      <div v-for="i in Math.min(totalReply, 2)" :key="i" class="flex items-start gap-2.5 animate-pulse py-1">
        <div class="w-6.5 h-6.5 rounded-full bg-zinc-200 dark:bg-zinc-800 flex-shrink-0"></div>
        <div class="flex-1 space-y-1.5 py-0.5">
          <div class="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-24"></div>
          <div class="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3"></div>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorReplies" class="ml-10 mt-2 pl-4 border-l border-red-200 text-red-500 text-xs py-1">
      {{ errorReplies }}
    </div>

    <!-- Sub-Replies (Recursive) -->
    <div v-if="showReplies && !props.isChild && localReplies.length > 0" class="ml-10 mt-2 pl-4 border-l border-zinc-150 dark:border-zinc-800/60 space-y-3">
      <CommentItem
        v-for="rep in localReplies"
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

