<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useUploadStore } from '@/stores/upload.store'
import { useUserStore } from '@/stores/user.store'
import type { UpdateAvatar } from '@/types/user.type'
import { CookieUtils } from '@/utils/cookie.util'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const userId = CookieUtils.get('userId') as string
const fileInput = ref<HTMLInputElement | null>(null)
const useUpload = useUploadStore()
const { uploadSingle } = useUpload
const { singleFile } = storeToRefs(useUpload)
const useUser = useUserStore()
const { updateAvatar } = useUser

const handleFileSelected = async (event: Event) => {
  const input = event.target as HTMLInputElement
  console.log('Event trigger !')
  const file = input.files && input.files[0]
  if (!file) {
    console.log('No file choose !')

    return
  }
  await uploadSingle({ file, userId });
  await updateOwnerInfo();

}
const updateOwnerInfo = async () => {
  console.log(singleFile.value);
  
  const dto: UpdateAvatar = { userId: userId, avatar: singleFile.value as any }
  await updateAvatar(dto)
}
const openFilePicker = () => {
  fileInput.value?.click()
  console.log('Input opened !')
}
</script>
<template>
  <Button
    variant="outline"
    class="dark:text-blue-600 border-none shadow-none p-1"
    @Click="openFilePicker"
  >
    Tải ảnh lên
  </Button>
  <input
    id="file"
    @change="handleFileSelected"
    type="file"
    placeholder="Enter your file"
    ref="fileInput"
    class="dark:text-gray-50 border-gray-700 border-2 hidden"
  />
</template>
<style></style>
