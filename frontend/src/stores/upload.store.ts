import { ref } from 'vue'
import { defineStore } from 'pinia'
import { uploadSingleFile, uploadMultipleFile } from '@/services/api/upload.api'
import type { UploadMultileReq, UploadReq } from '@/types/upload.type'
import type { File } from '@/types/common/file'
import { toast } from 'vue-sonner'

export const useUploadStore = defineStore('upload', () => {
  const isUploading = ref(false)
  const singleFile = ref<File | undefined>(undefined)
  const multipleFile = ref<File[] | undefined>(undefined)

  async function uploadSingle(dto: UploadReq) {
    isUploading.value = true
    try {
      const response = await uploadSingleFile(dto)
      singleFile.value = response;
      toast.success(`Upload thành công: ${response}`)
    } catch (error) {
      toast.error(`Lỗi upload: ${error}`)
      throw error
    } finally {
      isUploading.value = false
    }
  }

  async function uploadMultiple(dto: UploadMultileReq) {
    isUploading.value = true

    if (!dto.files || dto.files.length === 0) {
      toast.error('LỖI: Component đã gửi một mảng file rỗng!')
      isUploading.value = false
      throw new Error('No files provided for upload.')
    }

    try {
      const response = await uploadMultipleFile(dto)
      multipleFile.value = response
      toast.success(`Upload thành công: ${response}`)
    } catch (error) {
      toast.error(`Lỗi upload: ${error}`)
      throw error
    } finally {
      isUploading.value = false
    }
  }

  function clearSingleFile() {
    singleFile.value = undefined
  }

  function clearMultipleFiles() {
    multipleFile.value = undefined
  }

  return {
    isUploading,
    singleFile,
    multipleFile,
    uploadSingle,
    uploadMultiple,
    clearSingleFile,
    clearMultipleFiles,
  }
})