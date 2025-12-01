<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { useUploadStore } from '@/stores/upload.store'
import { CookieUtils } from '@/utils/cookie.util'
import { ref } from 'vue'

defineProps<{
  icon?: any
}>()

const userId = CookieUtils.get('userId') as string
const { uploadMultiple } = useUploadStore()

const fileInputRef = ref<HTMLInputElement | null>(null)

const openFileDialog = () => {
  fileInputRef.value?.click()
}

const handleFileSelected = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = input.files ? Array.from(input.files) : []
  if (files.length === 0) return

  uploadMultiple({ files, userId })
}
</script>

<template>
  <!-- Nếu có icon -->
  <div v-if="icon" class="flex items-center gap-2 m-2">
    <!-- Input hidden -->
    <input ref="fileInputRef" id="file" type="file" class="hidden" multiple @change="handleFileSelected" />

    <!-- Icon hiển thị và xử lý click -->
    <component :is="icon" class="cursor-pointer w-6 h-6  hover:scale-110" @click="openFileDialog" />
  </div>

  <!-- Nếu không có icon -->
  <Input v-else id="file" multiple type="file" placeholder="Enter your file" @change="handleFileSelected"
    class="dark:text-gray-50 border-gray-700 border-2" />
</template>

<style scoped></style>
