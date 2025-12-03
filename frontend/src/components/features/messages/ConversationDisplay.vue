<script setup lang="ts">
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useUserStore } from '@/stores/user.store'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'


const props = defineProps({
  conversation: {
    type: Object,
    required: true,
  },
  userId: String,
})
const useUser = useUserStore()
const { getParticipants } = useUser
const { paticipants } = storeToRefs(useUser)
const userSent = computed(() => {
  return props.conversation.lastest?.senderId === props.userId
})
const otherUser = computed(() => {
  return paticipants.value.find((p) => p.id !== props.userId)
})
onMounted(async () => {
  await getParticipants(props.conversation.participants)
})
</script>
<template>
  <div class="flex items-center gap-4">
    <Avatar class="size-12">
      <AvatarImage class="object-cover" :src="otherUser?.avatar?.url ||
        conversation?.avatar?.url
        " />
      <AvatarFallback>CF</AvatarFallback>
    </Avatar>

    <div class="flex flex-col items-center gap-2">
      <h6 class="m-0 text-xl font-thin">{{props.conversation.isGroup ? props.conversation.name : otherUser?.fullname }}</h6>
      <p class="text-xs m-0 text-gray-400">
        {{ userSent ? 'You :' : '' }} {{ props.conversation.lastest?.content }}
      </p>
    </div>
  </div>
</template>
