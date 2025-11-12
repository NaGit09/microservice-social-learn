<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useLikeStore } from '@/stores/like.store'
import type { LikeReq } from '@/types/like.type'
import { CookieUtils } from '@/utils/cookie.util'
import { Heart } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { toast } from 'vue-sonner'

const prop = defineProps({
  targetId: String,
  targetType: String,
})

const userId = CookieUtils.get('userId') as string

const like = useLikeStore()
const { Like, Unlike  } = like
const { isLiked } = storeToRefs(like)

const handleClick = async () => {
  const dto: LikeReq = {
    userId: userId,
    targetId: prop.targetId as string,
    targetType: prop.targetType as string,
  }

  try {
    if (!isLiked.value) {
        await Like(dto)
      isLiked.value =true
      toast.success(`Like ${prop.targetType} successfully !`)
    } else {
      await Unlike(dto)
      isLiked.value = false
      toast.success(`Unlike ${prop.targetType} successfully !`)
    }
  } catch (error) {
    isLiked.value = false
    console.error('Like/Unlike action failed:', error)
    toast.error(
      `Could not ${isLiked.value ? 'unlike' : 'like'} ${prop.targetType}. Please try again.`
    )
  }
}
</script>

<template>
  <Button @click="handleClick">
    <Heart :fill="isLiked ? 'white' : 'none'" />
  </Button>
</template>

<style></style>
