<script setup lang="ts">
import type { Message } from '@/types/message.type'
import {Forward } from 'lucide-vue-next'
import ReactPanel from './ReactPanel.vue'
import { useMessageStore } from '@/stores/message.store'
import { useUserStore } from '@/stores/user.store'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { Separator } from '@/components/ui/separator'
import MessageOption from './MessageOption.vue'
const props = defineProps<{
  message: Message
  userId: string
}>()

const { selectMessage } = useMessageStore()
const useUser = useUserStore()
const { paticipants } = storeToRefs(useUser)
const { setSelectedParticipant } = useUser
const getParticipant = computed(() => {
  return paticipants.value.find(
    (participant) => participant.id === props.message.senderId
  )
})
const handleSelect = (message: Message) => {
  selectMessage(message)
  setSelectedParticipant(getParticipant?.value)
}

const checkSender = () => {
  return props.message.senderId === props.userId
}
</script>
<template>
  <div class="flex w-full" :class="checkSender() ? 'justify-end' : 'justify-start'">
    <div class="relative flex flex-col gap-2 group" :class="checkSender() ? 'items-end' : 'items-start'">
      <!-- ACTION BUTTONS -->
      <div
        class="absolute top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 "
        :class="checkSender() ? 'right-full mr-2' : 'left-full ml-2'">

        <ReactPanel :messageId="message.id" :conversationId="message.convId" :userId="userId" />

        <button @click="handleSelect(message)"
          class="w-8 h-8 dark:text-white text-black flex items-center justify-center text-xs">
          <component :is="Forward" />
        </button>

        <MessageOption :isOwner="checkSender()" />
      </div>

      <!-- IMAGE MESSAGE -->
      <img v-if="message?.file" :src="message.file.url" :alt="message.file.fileName"
        class="object-contain max-w-[400px] max-h-[400px] rounded-lg" />

      <!-- TEXT MESSAGE -->
      <div class="flex relative gap-2">
        <div v-if="getParticipant && !checkSender()" class="flex items-center gap-2">
          <img :src="getParticipant.avatar.url" alt="" class="w-8 h-8 rounded-full" />
        </div>
        <div class="flex gap-2 relative flex-col" :class="checkSender() ? 'items-end' : 'items-start'">
          <div v-if="message.reply" class="flex items-center gap-2 flex-col mt-2">
            <p class="m-0 text-gray-600">
              {{ getParticipant?.fullname }} đã trả lời :
            </p>
            <div class="flex items-center gap-2 w-full" :class="checkSender() ? 'justify-end' : 'justify-start'">
              <Separator v-if="!checkSender()" class="bg-gray-700 rounded-full border-2 border-gray-700 h-full"
                orientation="vertical" />
              <p class="py-2 px-4 rounded-2xl text-white w-fit bg-gray-700 m-0">
                {{ message.reply.content }}
              </p>
              <Separator v-if="checkSender()" class="bg-gray-700 rounded-full border-2 border-gray-700 h-full"
                orientation="vertical" />
            </div>
          </div>

          <p v-if="message.content" class="py-2 px-4 rounded-2xl w-fit"
            :class="checkSender() ? 'bg-blue-500  text-white' : 'dark:bg-gray-600 bg-gray-300 text-black dark:text-white'">
            {{ message.content }}
          </p>
          <div :class="checkSender() ? '' : 'right-1/2'"
            class="absolute bottom-0 -translate-x-1/2 flex items-center gap-2 transition-opacity duration-150">
            <span v-for="(react, index) in message.reacts" :key="index">
              {{ react.reactIcon }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
