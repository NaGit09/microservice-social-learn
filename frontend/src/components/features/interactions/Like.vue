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
  variant: {
    type: String,
    default: 'button', // 'button' or 'text'
  },
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
  <!-- Button Variant (With background and padding) -->
  <Button v-if="variant === 'button'" @click="handleClick" 
    class="flex items-center gap-1.5 px-3 py-1.5 h-9 bg-transparent hover:bg-red-50/40 dark:hover:bg-red-950/25 text-gray-700 dark:text-gray-300 rounded-full transition-all duration-200 shadow-none border-none group active:scale-95 cursor-pointer select-none">
    <Heart 
      class="h-[18px] w-[18px] transition-all duration-300 ease-out"
      :class="isLikedLocal ? 'text-red-500 fill-red-500 scale-110' : 'text-gray-500 dark:text-gray-450 group-hover:text-red-500 group-hover:scale-110'"
    />
    <span class="text-xs font-semibold transition-colors" :class="isLikedLocal ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400'">
      {{ likedCount }}
    </span>
  </Button>

  <!-- Text Variant (No background, no padding) -->
  <button v-else @click="handleClick" 
    class="flex items-center gap-1 bg-transparent text-zinc-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200 group active:scale-95 cursor-pointer select-none border-none p-0">
    <Heart 
      class="h-4 w-4 transition-all duration-300 ease-out"
      :class="isLikedLocal ? 'text-red-500 fill-red-500 scale-110' : 'text-zinc-400 dark:text-zinc-500 group-hover:text-red-500 group-hover:scale-110'"
    />
    <span class="text-xs font-medium transition-colors" :class="isLikedLocal ? 'text-red-500 dark:text-red-400' : 'text-zinc-500 dark:text-zinc-405 group-hover:text-red-500'">
      {{ likedCount }}
    </span>
  </button>
</template>