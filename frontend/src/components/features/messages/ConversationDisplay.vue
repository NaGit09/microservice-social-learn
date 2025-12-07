<script setup lang="ts">
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { computed, onMounted, ref, type PropType } from 'vue'
import type { Conversation } from '@/types/conversation.type'
import { getParticipantsApi } from '@/services/api/user.api'
import type { UserInfo } from '@/types/user.type'

const props = defineProps({
  conversation: {
    type: Object as PropType<Conversation>,
    required: true,
  },
  userId: String,
})

const participants = ref<UserInfo[]>([])

const userSent = computed(() => {
  return props.conversation.lastest?.senderId === props.userId
})

const otherUser = computed(() => {
  return participants.value.find((p) => p.id !== props.userId)
})

const avatar = computed(() => {
  if (props.conversation.isGroup) {
    if(props.conversation.file){
      return props.conversation.file?.url
    }
    return '/src/assets/group-svgrepo-com.svg'
  }
  return otherUser.value?.avatar?.url
})

onMounted(async () => {
  if (props.conversation.participants && props.conversation.participants.length > 0) {
    const resp = await getParticipantsApi(props.conversation.participants)
    if (resp) {
      participants.value = resp
    }
  }
})
</script>
<template>
  <div class="flex items-center gap-4">
    <Avatar class="size-12">
      <AvatarImage class="object-cover" :src="avatar || ''" />
    </Avatar>

    <div class="flex flex-col items-center gap-2">
      <h6 class="m-0 text-xl font-thin">{{ props.conversation.isGroup ? props.conversation.name : otherUser?.fullname }}
      </h6>
      <p class="text-xs m-0 text-gray-400">
        {{ userSent ? 'You :' : '' }} {{ props.conversation.lastest?.content }}
      </p>
    </div>
  </div>
</template>
