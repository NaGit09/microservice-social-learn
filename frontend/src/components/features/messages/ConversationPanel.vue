<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { MessageSquarePlus } from 'lucide-vue-next'
import { useConversationStore } from '@/stores/conversation.store'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user.store'
import type { Conversation } from '@/types/conversation.type'
import ConversationDisplay from './ConversationDisplay.vue'
import { useMessageStore } from '@/stores/message.store'

const props = defineProps({
  userInfo: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['otherId'])

const conversationStore = useConversationStore()
const { selectConversation } = conversationStore
const { conversations, conversation: selectedConversation } =
  storeToRefs(conversationStore)

const useMessage = useMessageStore()
const { getMessages } = useMessage

const useUser = useUserStore()
const { getParticipants } = useUser
const { ownerInfo } = storeToRefs(useUser)
const handleClick = async (conv: Conversation) => {
  selectConversation(conv)

  if (!conv.isGroup) {
    const ortherId = conv.participants.filter(
      (id) => id !== ownerInfo?.value?.id || ''
    )[0]
    emit('otherId', ortherId)
  }
  await getParticipants(conv.participants)
  await getMessages(selectedConversation?.value?.id || '', ownerInfo?.value?.id || '')
}
</script>
<template>
  <div class="flex-1 flex h-full gap-2 flex-col border-r-1 border-r-gray-200 w-[calc(100%-2rem)]">
    <div class="flex items-center justify-between mt-5 mx-2 h-12">
      <h2 class="ml-2">{{ props.userInfo?.username }}</h2>
      <Button class="shadow-none">
        <component :is="MessageSquarePlus" />
      </Button>
    </div>
    <Separator class="bg-gray-200 overflow-hidden" />
    <div class="mx-3">
      <Button @click="handleClick(conversation)"
        class="shadow-none min-w-full h-full cursor-pointer hover:bg-gray-200 justify-start"
        :class="{ 'bg-gray-200 dark:bg-gray-800': selectedConversation?.id === conversation.id }" v-for="conversation in conversations"
        :key="conversation.id">
        <ConversationDisplay :conversation="conversation" :userId="ownerInfo?.id" />
      </Button>
    </div>
  </div>
</template>
