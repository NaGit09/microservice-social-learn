<script setup lang="ts">
import { ref } from 'vue';
import Button from '@/components/ui/button/Button.vue';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { useMessageStore } from '@/stores/message.store';
import type { NewReactMessage, React } from '@/types/message.type';
import { Smile } from 'lucide-vue-next'

const props = defineProps({
    conversationId: {
        type: String,
        required: true
    },
    messageId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
})

const isOpen = ref(false)
const useMessage = useMessageStore()
const { reactMessage } = useMessage
const handleClick = async (emoji: string) => {
    const react: React = {
        userId: props.userId,
        reactIcon: emoji
    }
    const reactMessageDto: NewReactMessage = {
        convId: props.conversationId,
        messageId: props.messageId,
        react: react
    }
    await reactMessage(reactMessageDto)
    
    isOpen.value = false
}
</script>

<template>
    <Popover v-model:open="isOpen">
        <PopoverTrigger as-child>
            <Button class="w-8 h-8 dark:text-white flex items-center justify-center text-xs" size="icon"
                variant="ghost">
                <component :is="Smile" />
            </Button>
        </PopoverTrigger>
        <PopoverContent class="bg-white dark:bg-gray-600 rounded-full px-2 py-1 w-fit shadow-full border-0">

            <div class="flex gap-4 items-center">
                <Button @click="handleClick('😁')"
                    class="hover:scale-110 shadow-none p-0 text-2xl transition ease-in-out duration-200 bg-transparent hover:bg-transparent">
                    😁
                </Button>
                <Button @click="handleClick('❤️')"
                    class="hover:scale-110 shadow-none p-0 text-2xl transition ease-in-out duration-200 bg-transparent hover:bg-transparent">
                    ❤️
                </Button>
                <Button @click="handleClick('😭')"
                    class="hover:scale-110 shadow-none p-0 text-2xl transition ease-in-out duration-200 bg-transparent hover:bg-transparent">
                    😭
                </Button>
                <Button @click="handleClick('👍🏻')"
                    class="hover:scale-110 shadow-none p-0 text-2xl transition ease-in-out duration-200 bg-transparent hover:bg-transparent">
                    👍🏻
                </Button>
                <Button @click="handleClick('😲')"
                    class="hover:scale-110 shadow-none p-0 text-2xl transition ease-in-out duration-200 bg-transparent hover:bg-transparent">
                    😲
                </Button>
            </div>
        </PopoverContent>
    </Popover>
</template>
