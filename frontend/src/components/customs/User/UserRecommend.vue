<script setup lang="ts">
import type { RecommentUser } from '@/types/user.type';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const recomment = defineProps<RecommentUser>();
 

</script>
<template>
    <div class="flex items-center justify-between">
        <div class="flex gap-3 items-center">
            <Avatar class="h-12 w-12 rounded-full">
                <AvatarImage :src="recomment?.avatar?.url ?? ''" :alt="recomment?.username ?? ''" />
                <AvatarFallback class="rounded-lg">
                    CN
                </AvatarFallback>
            </Avatar>
            <div class="user-infor flex   justify-center flex-col">
                <span class="font-bold text-md">{{ recomment?.username }}</span>
                <span class="text-sm">Suggest for you</span>
            </div>
        </div>
        <div class="follow-button">
            <Button class="border-0 px-5 bg-blue-500 rounded-xl">
                Follow
            </Button>
        </div>
    </div>
</template>