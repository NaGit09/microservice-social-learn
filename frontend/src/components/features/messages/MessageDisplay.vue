<script setup lang="ts">
import { useMessageStore } from '@/stores/message.store'
import { storeToRefs } from 'pinia'
import Message from './Message.vue'
import { nextTick, onMounted, ref, watch } from 'vue'

const props = defineProps<{ conversationId: string; userId: string }>()
const useMessage = useMessageStore()
const { getMessages } = useMessage
const { messages, pagination } = storeToRefs(useMessage)

const chatContainer = ref<HTMLElement | null>(null)
const isLoading = ref(false)

const loadMoreMessages = async () => {
  if (
    isLoading.value ||
    !pagination.value ||
    pagination.value.page >= pagination.value.totalPages
  )
    return

  const element = chatContainer.value
  if (!element) return

  isLoading.value = true
  const oldHeight = element.scrollHeight

  try {
    await getMessages(
      props.conversationId,
      props.userId,
      pagination.value.page + 1,
      10
    )

    nextTick(() => {
      const newHeight = element.scrollHeight
      element.scrollTop = newHeight - oldHeight
    })
  } finally {
    isLoading.value = false
  }
}

const handleScroll = () => {
  if (chatContainer.value?.scrollTop === 0) {
    loadMoreMessages()
  }
}

const scrollToBottom = () => {
  if (!chatContainer.value) return
  chatContainer.value.scrollTop = chatContainer.value.scrollHeight
}

onMounted(() => {
  nextTick(() => {
    scrollToBottom()
  })
})

watch(
  messages,
  () => {
    if (pagination.value?.page === 1) {
      nextTick(() => {
        scrollToBottom()
      })
    }
  },
  { deep: true }
)

defineExpose({
  scrollToBottom,
})
</script>
<template>
  <div class="flex-1 w-[calc(100%-2rem)] p-4">
    <div
      ref="chatContainer"
      class="max-h-[700px] overflow-y-scroll scroll-smooth my-8"
      @scroll="handleScroll"
    >
      <Message
        v-for="message in messages"
        :key="message.id"
        :message="message"
        :userId="userId"
      />
    </div>
  </div>
</template>
