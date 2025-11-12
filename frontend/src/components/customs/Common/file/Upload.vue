<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { useUploadStore } from '@/stores/upload.store'
import { CookieUtils } from '@/utils/cookie.util'

const uploadType = defineProps({
  uploadType: String,
})
const userId = CookieUtils.get('userId') as string

const { uploadSingle, uploadMultiple } = useUploadStore()

const handleFileSelected = async (event: Event) => {
  const input = event.target as HTMLInputElement
  console.log('Event trigger !')

  if (uploadType.uploadType === 'Avatar') {
    const file = input.files && input.files[0]
    if (!file) {
      console.log('No file choose !')

      return
    }
    uploadSingle({ file, userId })
  } else {
    const files = input.files ? Array.from(input.files) : []
    if (files.length === 0) return
    uploadMultiple({ files, userId })
  }
}
</script>
<template>
  <Input
    id="file"
    @change="handleFileSelected"
    type="file"
    placeholder="Enter your file"
    class="text-gray-50 border-gray-700 border-2"
    :multiple="uploadType.uploadType !== 'Avatar'"
  ></Input>
</template>
<style></style>
