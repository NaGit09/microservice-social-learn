<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useFollowStore } from '@/stores/follow.store'

const props = defineProps<{
  id: string
  status: string
  targetId: string
  requestId: string
}>()

const useFollow = useFollowStore()
const { followUser, unfollowUser, acceptFollow, rejectFollow } = useFollow

const handleFollow = async () => {
  console.log(props.id);
  
  if (props.status === 'follow') {
    await followUser(props.requestId, props.targetId, 'PENDING')
  } else if (props.status === 'unfollow') {
    await unfollowUser(props.requestId, props.targetId)
  } else if (props.status === 'accept') {
    await acceptFollow(props.id)
  } else {
    await rejectFollow(props.id)
  }
}
</script>

<template>
  <Button
    class="border-0 px-5 bg-blue-600 text-gray-50 hover:bg-blue-400 rounded-xl"
    @click="handleFollow"
  >
    {{ status }}
  </Button>
</template>
