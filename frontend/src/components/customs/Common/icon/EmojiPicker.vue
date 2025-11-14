<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { useColorMode } from '@vueuse/core';
import { Smile } from 'lucide-vue-next';
import EmojiPicker from 'vue3-emoji-picker'
// @ts-ignore - Ignore missing type declarations for emoji picker CSS import
import 'vue3-emoji-picker/css'
const emit = defineEmits(['selected']);

const onSelectEmoji = (emoji: { i: string }) => {
    emit('selected', emoji)
}
const mode = useColorMode()
</script>
<template>
    <div class="emoji-button-container">
        <Popover>
            <PopoverTrigger as-child>
                <Button class="bg-transparent shadow-none dark:text-gray-50">
                    <Smile />
                </Button>
            </PopoverTrigger>
            <PopoverContent class="dark:bg-gray-950 p-0 border-none">
                <EmojiPicker :theme="mode" :native="true" @select="onSelectEmoji" />
            </PopoverContent>
        </Popover>
    </div>
</template>
<style>
.comment-wrapper {
    float: right;
    width: 100%;
    max-width: 500px;
}

.comment-input-area {
    display: flex;
    align-items: center;
    border-radius: 22px;
    padding: 8px 12px;
}

.comment-input-area input {
    flex-grow: 1;
    border: none;
    outline: none;
    background: none;
    font-size: 0.9rem;
}

.emoji-button-container {
    position: relative;
    margin-left: 8px;
}

.emoji-button {
    border: none;
    background: none;
    cursor: pointer;
    font-size: 1.5rem;
    padding: 0;
    display: flex;
    align-items: center;
}

.picker-container-right {
    position: absolute;
    z-index: 10;
    left: 100%;
    bottom: 0;
    margin-left: 10px;
}
</style>
