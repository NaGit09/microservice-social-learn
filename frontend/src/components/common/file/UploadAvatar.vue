<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useUploadStore } from '@/stores/upload.store'
import { useUserStore } from '@/stores/user.store'
import type { UpdateAvatar } from '@/types/user.type'
import { CookieUtils } from '@/utils/cookie.util'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

const emit = defineEmits(['close'])

const userId = CookieUtils.get('userId') as string
const fileInput = ref<HTMLInputElement | null>(null)
const useUpload = useUploadStore()
const { uploadSingle } = useUpload
const { singleFile } = storeToRefs(useUpload)
const useUser = useUserStore()
const { updateAvatar } = useUser

const handleFileSelected = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files && input.files[0]
  if (!file) {
    toast.error('Lỗi: Không có file nào được chọn')
    return
  }
  await uploadSingle({ file, userId })
  await updateOwnerInfo()
  emit('close')
}

const updateOwnerInfo = async () => {
  const dto: UpdateAvatar = { userId: userId, avatar: singleFile.value as any }
  console.log(dto);
  
  await updateAvatar(dto)
}

const openFilePicker = () => {
  fileInput.value?.click()
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
