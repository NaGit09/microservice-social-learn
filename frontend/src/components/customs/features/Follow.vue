<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useFollowStore } from '@/stores/follow.store'
import { CookieUtils } from '@/utils/cookie.util'
import { ref, watch } from 'vue' 

const props = defineProps({
  targetId: {
    type: String,
    required: true
  },
  initialIsFollowed: {
    type: Boolean,
    default: false
  }
})

const useFollow = useFollowStore()
const { followUser, unfollowUser } = useFollow
const requestId = CookieUtils.get('userId') as string 

const isLoading = ref(false)

const isFollowed = ref(props.initialIsFollowed)

watch(() => props.initialIsFollowed, (newValue) => {
  isFollowed.value = newValue
})

const handleFollow = async () => {
  if (isLoading.value) return

  if (!requestId || !props.targetId) {
    console.error('Missing user ID or target ID')
    return
  }

  isLoading.value = true
  const originalState = isFollowed.value  

  try {
    if (!isFollowed.value) {
      isFollowed.value = true
      await followUser(requestId, props.targetId, 'PENDING')
    } else {
      isFollowed.value = false 
      await unfollowUser(requestId, props.targetId) 
    }
  } catch (error) {
    console.error('Failed to update follow status:', error)
    isFollowed.value = originalState
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Button v-if="requestId" class="border-0 px-5
   bg-blue-600 text-gray-50 hover:bg-blue-400 rounded-xl"
    @click="handleFollow" :disabled="isLoading">
    <span v-if="isLoading">Đang xử lý...</span>
    <span v-else>{{ isFollowed ? 'Unfollow' : 'Follow' }}</span>
  </Button>
</template>