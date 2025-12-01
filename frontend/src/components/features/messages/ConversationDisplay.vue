<script setup lang="ts">
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { computed } from 'vue';

const props = defineProps({
    conversation: {
        type: Object,
        required: true
    },
    userId : String,
})
const userSent = computed(() => {
    return props.conversation.lastest?.senderId === props.userId
})
</script>
<template>
    <div class="flex items-center gap-4">
        <Avatar class="size-12">
            <AvatarImage :src="props.conversation.file.url" />
            <AvatarFallback>CF</AvatarFallback>
        </Avatar>

        <div class="flex flex-col items-center gap-2">
            <h6 class="m-0 text-xl font-thin">{{ props.conversation.name }}</h6>
            <p class="text-xs m-0 text-gray-400">{{ userSent ? 'You :'  : '' }} {{ props.conversation.lastest?.content }}</p>
        </div>
    </div>
</template>