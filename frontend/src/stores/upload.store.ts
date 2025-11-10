import { ref } from 'vue'
import { defineStore } from 'pinia'
import { uploadSingleFile, uploadMultipleFile } from '@/services/api/upload.api'
import type { UploadMultileReq, UploadReq } from '@/types/upload.type'
import type { File } from '@/types/common/file'

export const useUpload = defineStore('upload', () => {
  // state
  const isUploading = ref(false)
  const singleFile = ref<File>()
  const multipleFile = ref<File[]>()

  // upload a file
  async function uploadSingle(dto: UploadReq) {
    isUploading.value = true
    try {
      const response = await uploadSingleFile(dto)
      singleFile.value = response
      console.log('Upload thành công:', response)
    } catch (error) {
      console.error('Lỗi upload:', error)
    } finally {
      isUploading.value = false
    }
  }
  async function uploadMultiple(dto: UploadMultileReq) {
    isUploading.value = true;

    if (!dto.files || dto.files.length === 0) {
      console.error('LỖI: Component đã gửi một mảng file rỗng!');
      isUploading.value = false;
      return;
    }

    try {
      const response = await uploadMultipleFile(dto);
      multipleFile.value = response;
      console.log('Upload thành công:', response);

    } catch (error) {
      console.error('Lỗi upload:', error);
    } finally {
      isUploading.value = false;
    }
  }
  return {
    isUploading,
    singleFile,
    multipleFile,
    uploadSingle,
    uploadMultiple,
  }
})