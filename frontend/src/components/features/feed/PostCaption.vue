<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { getUserInfoApi } from '@/services/api/user.api'

const isOpen = ref(false)
const previewLength = 60

const prop = defineProps<{
  caption: String
  userId: String
}>()

const authorInfo = ref<{ username: string } | null>(null)
const isLoading = ref(true) 

onMounted(async () => {
  if (!prop.userId) {
    isLoading.value = false
    authorInfo.value = { username: 'Người dùng ẩn danh' }
    return
  }

  try {
    const user = await getUserInfoApi(prop.userId as string) 
    authorInfo.value = user
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin user ${prop.userId}:`, error)
    authorInfo.value = { username: 'Người dùng lỗi' }
  } finally {
    isLoading.value = false
  }
})

const previewText = computed(() => {
  if (prop.caption.length <= previewLength) return prop.caption

  const truncated = prop.caption.substring(0, previewLength)

  return truncated.substring(
    0,
    Math.min(truncated.length, truncated.lastIndexOf(' '))
  )
})

const restOfText = computed(() => {
  if (prop.caption.length <= previewLength) return ''

  return prop.caption.substring(previewText.value.length)
})

const hasMore = computed(() => prop.caption.length > previewLength)
</script>

<template>
  <Collapsible v-model:open="isOpen" class="space-y-1 w-full">
    <p class="m-0 text-sm text-zinc-700 dark:text-zinc-300 leading-snug text-wrap">
      <span v-if="!isLoading" class="font-semibold text-zinc-900 dark:text-zinc-50 mr-1.5 hover:text-primary cursor-pointer transition-colors">
        {{ authorInfo?.username }}
      </span>

      <span>{{ previewText }}</span>

      <span v-if="!isOpen && hasMore" class="text-zinc-400 dark:text-zinc-500">...</span>

      <CollapsibleContent as="span" class="transition-all duration-200">
        {{ restOfText }}
      </CollapsibleContent>
      
      <CollapsibleTrigger as-child v-if="hasMore">
        <Button class="p-0 h-auto text-xs font-medium text-zinc-400 hover:text-primary dark:text-zinc-500 dark:hover:text-primary transition-colors bg-transparent hover:bg-transparent shadow-none border-none ml-1 inline-flex">
          {{ isOpen ? 'Thu gọn' : 'Xem thêm' }}
        </Button>
      </CollapsibleTrigger>
    </p>
  </Collapsible>
</template>
