<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useUserStore } from '@/stores/user.store'
import { storeToRefs } from 'pinia'

const isOpen = ref(false)

const previewLength = 100

const prop = defineProps<{
  caption: String
  userId: String
}>()

const userStore = useUserStore();
const { getInfo } = userStore;
const { userInfo } = storeToRefs(userStore);

onMounted(() => {
  getInfo(prop.userId as string)
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
    <p class="text-sm text-gray-100 text-wrap">
        <span class="font-bold text-xl">{{ userInfo?.username }} :</span>
      {{ previewText }}

      <span v-if="!isOpen && hasMore">...</span>

      <CollapsibleContent as="span">
        {{ restOfText }}
      </CollapsibleContent>
    </p>

    <CollapsibleTrigger as-child v-if="hasMore">
      <Button class="p-0 h-auto text-sm">
        {{ isOpen ? 'Thu gọn' : 'Xem thêm' }}
      </Button>
    </CollapsibleTrigger>
  </Collapsible>
</template>
