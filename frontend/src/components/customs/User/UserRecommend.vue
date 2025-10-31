<script setup lang="ts">
import type { RecommentUser } from '@/types/user.type';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const recomment = defineProps<RecommentUser>();
 

</script>
<template>
    <div class="flex items-center gap-3 m-2">
        <Avatar class="h-12 w-12 rounded-full">
            <AvatarImage :src="recomment?.avatar?.url ?? ''" :alt="recomment?.username ?? ''" />
            <AvatarFallback class="rounded-lg">
                CN
            </AvatarFallback>
        </Avatar>
        <div class="user-infor flex   justify-center flex-col">
            <span>{{ recomment?.username }}</span>
            <span>Suggest for you</span>
        </div>
        <div class="">
        </div>
    </div>
</template>