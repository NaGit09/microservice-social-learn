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
                <Button variant="ghost" size="icon" class="h-8 w-8 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-full p-0 bg-transparent hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 shadow-none border-none cursor-pointer">
                    <Smile class="size-5" />
                </Button>
            </PopoverTrigger>
            <PopoverContent class="p-0 border-none bg-transparent shadow-2xl">
                <EmojiPicker :theme="mode" :native="true" @select="onSelectEmoji" />
            </PopoverContent>
        </Popover>
    </div>
</template>

<style>
/* Override vue3-emoji-picker theme colors to match Obsidian theme */
.v3-emoji-picker {
    --v3-background: hsl(var(--card)) !important;
    --v3-border-color: hsl(var(--border)) !important;
    --v3-search-input-background: hsl(var(--muted)) !important;
    --v3-search-input-border-color: hsl(var(--border)) !important;
    --v3-search-input-text-color: hsl(var(--foreground)) !important;
    border: 1px solid hsl(var(--border)) !important;
    border-radius: 12px !important;
    font-family: inherit !important;
}

.emoji-button-container {
    position: relative;
    display: flex;
    align-items: center;
}
</style>
