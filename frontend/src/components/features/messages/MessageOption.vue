<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { CircleAlert, Copy, EllipsisVertical, Trash2 } from 'lucide-vue-next';
import { Separator } from '@/components/ui/separator';
import { ref } from 'vue';
defineProps<{ 
    isOwner: boolean
}>()
const isOpen = ref(false)

const handleRecall = () => {
    isOpen.value = false
}
const handleCopy = () => {
    isOpen.value = false
} 
</script>

<template>
    <Popover v-model:open="isOpen">
        <PopoverTrigger>
            <component :is="EllipsisVertical" />
        </PopoverTrigger>
        <PopoverContent
            class="message-option-content p-0 max-w-[150px] bg-white dark:bg-gray-800 flex items-center gap-2 flex-col border-0 shadow-lg">
            <div v-if="isOwner" class="flex items-center justify-between gap-2">
                <Button class="p-2 text-red-500 shadow-none" @click="handleRecall">Thu hồi</Button>
                <component class="text-red-500" :is="Trash2" />
            </div>
            <div v-if="!isOwner" class="flex items-center justify-between gap-2">
                <Button class="p-2 text-red-500 shadow-none" @click="handleRecall">Báo cáo</Button>
                <component class="text-red-500" :is="CircleAlert" />
            </div>
            <Separator class="bg-gray-500 dark:bg-gray-700 w-full" />
            <div class="flex items-center justify-between gap-2">
                <Button class="p-2 text-gray-500 shadow-none" @click="handleCopy">Sao chép</Button>
                <component class="text-gray-500" :is="Copy" />
            </div>
        </PopoverContent>
    </Popover>
</template>
