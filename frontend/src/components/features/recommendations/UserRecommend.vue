<script setup lang="ts">
import type { RecommentUser } from '@/types/user.type'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import Follow from '../../features/interactions/Follow.vue'

const recomment = defineProps<RecommentUser>()
</script>
<template>
  <RouterLink custom v-slot="{ navigate }" :to="`/profile/${recomment.id}`">
    <div class="flex items-center justify-between" @click="navigate">
      <div class="flex gap-3 items-center">
        <Avatar class="h-12 w-12 rounded-full">
          <AvatarImage class="object-cover" :src="recomment?.avatar?.url ?? ''" :alt="recomment?.username ?? ''" />
          <AvatarFallback class="rounded-lg"> CN </AvatarFallback>
        </Avatar>
        <div class="user-infor flex justify-center flex-col">
          <span class="font-bold text-md dark:text-gray-200">{{
            recomment?.username
            }}</span>
          <span class="text-sm dark:text-gray-400">Suggest for you</span>
        </div>
      </div>
      <Follow :target-id="recomment.id" />
    </div>
  </RouterLink>
</template>
