<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-vue-next';

defineProps<{
    totalComment : Number
}>()
</script>
<template>
    <Button class="shadow-none dark:text-gray-50">
        <span>{{totalComment }}</span>
        <MessageCircle  />
    </Button>
</template>
<style></style>