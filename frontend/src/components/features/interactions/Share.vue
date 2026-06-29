<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Forward } from 'lucide-vue-next';


</script>
<template>
    <Button class="flex items-center gap-1.5 px-3 py-1.5 h-9 bg-transparent hover:bg-green-50/40 dark:hover:bg-green-950/25 text-gray-700 dark:text-gray-300 rounded-full transition-all duration-200 shadow-none border-none group active:scale-95 cursor-pointer select-none">
        <Forward class="h-[18px] w-[18px] text-gray-500 dark:text-gray-450 group-hover:text-green-500 group-hover:scale-110 transition-all duration-300 ease-out" />
        <span class="text-xs font-semibold text-gray-600 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
            {{ 0 }}
        </span>
    </Button>
</template>
<style></style>