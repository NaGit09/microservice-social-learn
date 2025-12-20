<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useLikeStore } from '@/stores/like.store'
import type { LikeReq } from '@/types/like.type'
import { CookieUtils } from '@/utils/cookie.util'
import { Heart } from 'lucide-vue-next'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

const prop = defineProps({
  totalLike: Number,
  targetId: String,
  targetType: String,
  isInitiallyLiked: Boolean,
})

const userId = CookieUtils.get('userId') as string

const like = useLikeStore()
const { Like, Unlike } = like 

const likedCount = ref(prop.totalLike)
const isLikedLocal = ref(prop.isInitiallyLiked)

const handleClick = async () => {
  const dto: LikeReq = {
    userId: userId,
    targetId: prop.targetId as string,
    targetType: prop.targetType as string,
  }
  console.log(dto);
  
  try {
    if (!isLikedLocal.value) {
      await Like(dto)
      isLikedLocal.value = true 

      if (likedCount.value !== undefined) {
        likedCount.value++
      }
      toast.success(`Like ${prop.targetType} successfully !`)
    } else {
      await Unlike(dto)
      isLikedLocal.value = false
      if (likedCount.value !== undefined && likedCount.value > 0) {
        likedCount.value--
      }
      toast.success(`Unlike ${prop.targetType} successfully !`)
    }
  } catch (error) {
    console.error('Like/Unlike action failed:', error)
    toast.error(
      `Could not ${isLikedLocal.value ? 'like' : 'unlike'} 
      ${prop.targetType}. Please try again.`
    )
  }
}
</script>

<template>
  <Button @click="handleClick" 
  class="shadow-none bg-transparent text-dark dark:text-white">
    <span>{{ likedCount }}</span>
    <Heart :fill="isLikedLocal ? 'red' : 'none'"/>
  </Button>
</template>