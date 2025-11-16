<script setup lang="ts">
import { Button } from '@/components/ui/button'
import type { File } from '@/types/common/file'
import { ArrowDownToLine } from 'lucide-vue-next'
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'

const props = defineProps<File>()
const isLoading = ref(false)
const fileColorMap = {
  pdf: 'bg-red-500 text-red-100',
  word: 'bg-blue-600 text-blue-100',
  doc: 'bg-blue-600 text-blue-100',
  xls: 'bg-green-600 text-green-100',
  excel: 'bg-green-600 text-green-100',
  ppt: 'bg-orange-500 text-orange-100',
  powerpoint: 'bg-orange-500 text-orange-100',
  zip: 'bg-gray-600 text-gray-100',
  rar: 'bg-gray-600 text-gray-100',
  jpg: 'bg-purple-600 text-purple-100',
  jpeg: 'bg-purple-600 text-purple-100',
  png: 'bg-purple-600 text-purple-100',
} as const

const fileTypeClasses = computed(() => {
  const type = props.type?.toLowerCase() || 'default'
  for (const key in fileColorMap) {
    if (type.includes(key)) {
      // @ts-ignore
      return fileColorMap[key]
    }
  }
  return 'bg-gray-400 text-gray-100'
})

async function downloadFile() {
  if (isLoading.value || !props.url) return
  isLoading.value = true
  try {
    const response = await fetch(props.url as string)
    if (!response.ok)
      throw new Error(`Network response was not ok (${response.status})`)
    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = blobUrl
    link.download = (props.fileName as string) || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(blobUrl)
    toast.success('Download file thành công !')
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Lỗi không xác định'
    toast.error(`Lỗi tải file: ${message}`)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex flex-wrap gap-2 mt-2 ml-2">
    <div
      class="inline-flex items-center gap-3 px-2 rounded-full border
       dark:bg-gray-50 bg-card p-1 shadow-sm transition-all hover:shadow-md
        max-w-full relative"
    >
      <h6 class="m-0 flex-1 truncate text-sm font-bold text-black ml-1">
        {{ fileName }}
      </h6>

      <Button
        variant="ghost"
        size="icon"
        @click.prevent="downloadFile"
        class="rounded-full flex-shrink-0"
        :disabled="isLoading"
      >
        <ArrowDownToLine class="h-4 w-4 text-blue-400" />
      </Button>
      <span
        v-if="type"
        :class="[
          fileTypeClasses,
          'flex-shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase absolute -top-5.5 -right-3',
        ]"
      >
        {{ type?.split('/')[1] }}
      </span>
    </div>
  </div>
</template>
