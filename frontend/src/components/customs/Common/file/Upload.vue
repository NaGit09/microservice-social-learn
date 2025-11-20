<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { useUploadStore } from '@/stores/upload.store'
import { CookieUtils } from '@/utils/cookie.util'


const userId = CookieUtils.get('userId') as string

const { uploadMultiple } = useUploadStore()

const handleFileSelected = async (event: Event) => {
  const input = event.target as HTMLInputElement
  console.log('Event trigger !')
  const files = input.files ? Array.from(input.files) : []
  if (files.length === 0) return
  uploadMultiple({ files, userId })
}
</script>
<template>
  <Input
    id="file"
    @change="handleFileSelected"
    multiple
    type="file"
    placeholder="Enter your file"
    class="dark:text-gray-50 border-gray-700 border-2"
  ></Input>
</template>
<style></style>
