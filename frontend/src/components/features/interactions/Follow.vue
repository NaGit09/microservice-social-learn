<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useFollowStore } from '@/stores/follow.store'

const props = defineProps<{
  id: string
  status: string
  targetId: string
  requestId: string
}>()

const emit = defineEmits<{
  (e: 'success', newStatus: string): void
}>()

const useFollow = useFollowStore()

const { followUser, unfollowUser, acceptFollow, rejectFollow } = useFollow

const handleFollow = async () => {
  try {
    if (props.status === 'follow') {
      await followUser(props.requestId, props.targetId, 'PENDING')
      emit('success', 'PENDING')
    }
    else if (props.status === 'unfollow') {
      await unfollowUser(props.requestId, props.targetId)
      emit('success', 'follow')
    }
    else if (props.status === 'PENDING' || props.status === 'Requested') {
      // Treat pending as unfollow (cancel request) if desired, or do nothing
      // For now, let's allow cancelling request (unfollow)
      await unfollowUser(props.requestId, props.targetId)
      emit('success', 'follow')
    }
    else if (props.status === 'accept') {
      await acceptFollow(props.id)
      emit('success', 'friend')
    }
    else if (props.status === 'reject') {
      await rejectFollow(props.id)
      emit('success', 'rejected')
    }
  } catch (error) {
    console.error("Follow action failed", error)
  }
}
</script>

<template>
  <Button
    class="border-0 px-5 bg-blue-600 text-gray-50 hover:bg-blue-400 rounded-xl transition-colors disabled:opacity-50"
    :class="{
      'bg-gray-600 hover:bg-gray-500': status === 'PENDING' || status === 'Requested' || status === 'unfollow',
      'bg-green-600 hover:bg-green-500': status === 'accept'
    }" @click="handleFollow">
    {{ status === 'PENDING' ? 'Requested' : status }}
  </Button>
</template>
