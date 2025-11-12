<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { useFollowStore } from '@/stores/follow.store';
import { CookieUtils } from '@/utils/cookie.util';

defineProps({
    targetId: String,
})
const useFollow = useFollowStore();
const requestId = CookieUtils.get("userId");

const handleFollow = async () => {
    
}
</script>
<template>
    <Button class="border-0 px-5 bg-blue-500 rounded-xl"> Follow </Button>
</template>