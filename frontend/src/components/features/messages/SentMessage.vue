<script setup lang="ts">
import Upload from '@/components/common/file/Upload.vue'
import EmojiPicker from '@/components/common/icon/EmojiPicker.vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMessageStore } from '@/stores/message.store'
import { useUploadStore } from '@/stores/upload.store'
import type { NewMessage } from '@/types/message.type'
import { Image, X } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { useUserStore } from '@/stores/user.store'

const props = defineProps({
  conversationId: {
    type: String,
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['message-sent'])
const useUser = useUserStore()
const { selectedParticipant  } = storeToRefs(useUser)
const useUpload = useUploadStore()
const { multipleFile } = storeToRefs(useUpload)

const content = ref('')

const onSelectEmoji = (emoji: { i: string }) => {
  content.value += emoji.i
}
const useMessage = useMessageStore()
const { sendMessage } = useMessage
const { message } = storeToRefs(useMessage)
// Xử lý upload file
const handleClickMessage = async () => {
  if (
    content.value.trim() === '' &&
    (!multipleFile.value || multipleFile.value.length === 0)
  )
    return

  const messageCreate: NewMessage = {
    convId: props.conversationId,
    content: content?.value,
    senderId: props.senderId,
    file: multipleFile?.value?.[0],
    replyId: message?.value?.id || '',
  }
  await sendMessage(messageCreate)
  emit('message-sent')
  toast.success('Gửi tin nhắn thành công')
  content.value = ''
  multipleFile.value = []
  message.value = null

}
</script>

<template>
  <div class="absolute bottom-0 left-0  w-full bg-white dark:bg-black">
    <div class="flex flex-col items-center justify-center border border-gray-200 rounded-lg m-2 relative">
      <Button v-if="message" @click="message = null" class="absolute top-0 text-red-600 right-0">
        <component :is="X" />
      </Button>
      <div v-if="multipleFile && multipleFile.length > 0" class="w-20 h-20 ml-4 self-start relative mt-2">


        <img :src="multipleFile[0]?.url" class="w-full h-full object-cover rounded-lg border border-gray-200" />
        <button @click="multipleFile = []"
          class="absolute -top-2 -right-2 bg-gray-500 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600">
          <component :is="X" />
        </button>
      </div>
      <div v-if="message" class="ml-4 self-start relative mt-2 gap-2 flex flex-col">
        <p class="m-0 font-thin">Đang trả lời : <span class="font-semibold">{{ selectedParticipant?.fullname }}</span>
        </p>
        <span class="font-thin text-gray-500">
          {{ message?.content }}

        </span>
      </div>
      <div class="flex items-center gap-2 w-full max-h-[40px] mx-auto">
        <EmojiPicker class="hover:scale-110" @selected="onSelectEmoji" />

        <Input v-model="content" @keydown.enter.prevent="handleClickMessage"
          class="border-0 shadow-none dark:text-white" placeholder="Nhập tin nhắn...." />

        <!-- Upload chỉ hiển thị khi input rỗng -->
        <Upload v-if="content.trim() === '' || multipleFile?.length === 0" class="border-0 shadow-none" :icon="Image" />
        <Button @click="handleClickMessage" v-if="
          content.trim() !== '' || (multipleFile && multipleFile.length > 0)
        " class="text-blue-500 hover:text-blue-600 px-4 py-2 rounded-full">Gửi</Button>
      </div>
    </div>
  </div>
</template>
