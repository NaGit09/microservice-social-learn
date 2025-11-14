<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { getUserInfo } from '@/services/api/user.api'

const isOpen = ref(false)
const previewLength = 100

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
    const user = await getUserInfo(prop.userId as string) 
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
  <Collapsible v-model:open="isOpen" class="space-y-2 ml-2">
    <p class="text-sm dark:text-gray-100 text-wrap">
      <span v.if="!isLoading" class="font-bold text-sm">
        {{ authorInfo?.username }} :
      </span>

      {{ previewText }}

      <span v-if="!isOpen && hasMore">...</span>

      <CollapsibleContent as="span">
        {{ restOfText }}
      </CollapsibleContent>
    </p>

    <CollapsibleTrigger as-child v-if="hasMore">
      <Button class="p-0 h-auto text-sm shadow-none text-gray-400">
        {{ isOpen ? 'Thu gọn' : 'Xem thêm' }}
      </Button>
    </CollapsibleTrigger>
  </Collapsible>
</template>
