<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { MessageCircleHeart } from 'lucide-vue-next'

import type { Conversation } from '@/types/conversation.type'
import MessageHeader from './MessageHeader.vue'
import MessageDisplay from './MessageDisplay.vue'
import SentMessage from './SentMessage.vue'
import { ref } from 'vue'

defineProps<{
  conversation?: Conversation
  userId: string
}>()

const messageDisplayRef = ref<InstanceType<typeof MessageDisplay> | null>(null)

const handleMessageSent = () => {
  if (messageDisplayRef.value) {
    messageDisplayRef.value.scrollToBottom()
  }
}

</script>
<template>
  <div class="flex flex-col items-center justify-center h-full flex-3 w-full relative">
    <div class="flex flex-col items-center justify-center h-full" v-if="!conversation">
      <component :is="MessageCircleHeart" class="size-30" :stroke-width="1" />
      <p>Tin nhắn của bạn</p>
      <p>Gửi ảnh và tin nhắn riêng tư cho bạn bè hoặc nhóm</p>
      <Button variant="secondary" class="bg-blue-500 text-white text-sm font-bold hover:bg-blue-700">Gửi tin
        nhắn</Button>
    </div>
    <div v-else class="flex flex-col items-center justify-center h-full w-full">
      <MessageHeader :isGroup="conversation.isGroup" :groupAvatar="conversation.file.url"
        :groupname="conversation.name" :userId="userId" />
      <MessageDisplay ref="messageDisplayRef" :conversation-id="conversation.id" :user-id="userId" />
      <SentMessage @message-sent="handleMessageSent" :conversation-id="conversation.id" :sender-id="userId" />
    </div>
  </div>
</template>
