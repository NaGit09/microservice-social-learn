<script setup lang="ts">
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ref, computed } from 'vue' // <-- Thêm computed
import { Plus } from 'lucide-vue-next'
import EmojiPicker from '../icon/EmojiPicker.vue'
import Upload from '../file/Upload.vue'
import { usePostStore } from '@/stores/post.store'
import type { CreatePost } from '@/types/post.type'
import { useUploadStore } from '@/stores/upload.store'
import { storeToRefs } from 'pinia'
import type { File } from '@/types/common/file'
import { toast } from 'vue-sonner'

// *** TỐI ƯU ***
// Thay vì đọc cookie trực tiếp, hãy tạo một store (ví dụ: useUserStore)
// để quản lý thông tin người dùng. Điều này giúp code sạch và dễ test hơn.
// import { useUserStore } from '@/stores/user.store'

// Dưới đây là code TẠM THỜI nếu bạn CHƯA CÓ useUserStore
import { CookieUtils } from '@/utils/cookie.util'
import type { UserInfo } from '@/types/user.type'
const ownerInfo = CookieUtils.getObject<UserInfo>('ownerInfo')
const userId = CookieUtils.get('userId') as string
// --------------------------------------------------

defineProps({
  open: {
    type: Boolean,
    required: true,
  },
})

// === CÀI ĐẶT STORE ===
const postStore = usePostStore()
const uploadStore = useUploadStore()
const { multipleFile } = storeToRefs(uploadStore)

const MAX_CAPTION_LENGTH = 2000
const area = ref('')
const isLoading = ref(false)
const isDialogOpen = ref(false)

// Tối ưu: Thêm computed prop để validation
const isFormInvalid = computed(() => {
  return (
    area.value.trim().length === 0 ||
    area.value.length > MAX_CAPTION_LENGTH ||
    !multipleFile.value ||
    multipleFile.value.length === 0
  )
})

// === HÀM XỬ LÝ ===
const onSelectEmoji = (emoji: { i: string }) => {
  if (area.value.length < MAX_CAPTION_LENGTH) {
    area.value += emoji.i
  }
}

const resetForm = () => {
  area.value = ''
  uploadStore.clearMultipleFiles() // <-- Sửa: clearMultipleFiles (giả sử)
}

const handleSubmitPost = async () => {
  // 1. Set Loading
  isLoading.value = true

  // 2. Validation (đã được kiểm tra bằng computed 'isFormInvalid')
  // Bạn vẫn có thể thêm kiểm tra ở đây nếu muốn
  if (isFormInvalid.value) {
    toast.warning('Please fill in all fields and upload at least one file.')
    isLoading.value = false
    return
  }

  try {
    // 3. Tạo DTO
    const dto: CreatePost = {
      author: userId,
      caption: area.value,
      files: multipleFile.value as File[], // Đảm bảo multipleFile là một mảng File[]
      mode: 'public',
    }
    await postStore.createPost(dto)
    toast.success('Create post successfully!')
    resetForm()
    isDialogOpen.value = false
  } catch (error: any) {
    console.error('Failed to create post:', error)
    toast.error(error.message || 'An unexpected error occurred.')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Dialog v-model:open="isDialogOpen">
    <DialogTrigger as-child>
      <SidebarMenuButton class="bg-black text-gray-300 border-0 text-xl mb-2 w-[220px]" size="lg">
        <div class="flex items-center justify-between gap-2 w-full">
          <div class="flex aspect-square size-8 items-center justify-center rounded-lg">
            <component :is="Plus" class="size-6" />
          </div>
          <div v-if="open" class="grid flex-1 leading-tight text-left">
            <span class="truncate font-semibold"> Create </span>
          </div>
        </div>
      </SidebarMenuButton>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px] bg-gray-950">
      <DialogHeader>
        <DialogTitle class="text-gray-200 text-center">
          Create new post
        </DialogTitle>
      </DialogHeader>

      <form @submit.prevent="handleSubmitPost">
        <div class="flex items-start justify-start flex-col gap-3">
          <div class="flex gap-3 items-center">
            <Avatar class="h-6 w-6 rounded-full">
              <AvatarImage :src="ownerInfo?.avatar?.url ?? ''" :alt="ownerInfo?.username ?? ''" />
              <AvatarFallback class="rounded-lg"> CN </AvatarFallback>
            </Avatar>
            <div class="user-infor flex justify-start flex-col">
              <span class="font-bold text-md text-gray-100">{{
                ownerInfo?.username
                }}</span>
            </div>
          </div>
          <Textarea id="area" v-model="area" class="text-gray-300 border-gray-700 w-full"
            placeholder="Type your message here." />
          <div class="flex justify-between items-center w-full">
            <div class="text-sm" :class="{
              'text-gray-400': area.length <= MAX_CAPTION_LENGTH,
              'text-red-500': area.length > MAX_CAPTION_LENGTH,
            }">
              {{ area.length }}/{{ MAX_CAPTION_LENGTH }}
            </div>
            <EmojiPicker @selected="onSelectEmoji" />
          </div>
          <Upload upload-type="Post" class="w-full" />
        </div>

        <DialogFooter class="mt-4">
          <Button type="submit" class="bg-blue-600" :disabled="isLoading || isFormInvalid">
            <span v-if="isLoading">Posting...</span>
            <span v-else>Create</span>
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>