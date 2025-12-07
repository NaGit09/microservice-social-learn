<script setup lang="ts">
import type { RecommentUser } from '@/types/user.type'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import Follow from '../../features/interactions/Follow.vue'
import { CookieUtils } from '@/utils/cookie.util'
import { computed } from 'vue';
import { DEFAULT_AVATAR } from '@/constant/default.constant';

const recomment = defineProps<RecommentUser>()
const userId = CookieUtils.get('userId') as string
const avatar = computed(() => {
  if(recomment?.avatar?.url){
    return recomment?.avatar?.url
  }
  return DEFAULT_AVATAR
})
</script>
<template>
  <RouterLink custom v-slot="{ navigate }" :to="`/profile/${recomment.id}`">
    <div class="flex items-center justify-between" @click="navigate">
      <div class="flex gap-3 items-center">
        <Avatar class="h-12 w-12 rounded-full">
          <AvatarImage class="object-cover" :src="avatar" :alt="recomment?.username ?? DEFAULT_AVATAR" />
          <AvatarFallback class="rounded-lg">
CN          </AvatarFallback>
        </Avatar>
        <div class="user-infor flex justify-center flex-col">
          <span class="font-bold text-md dark:text-gray-200">{{
            recomment?.username
            }}</span>
          <span class="text-sm dark:text-gray-400">Suggest for you</span>
        </div>
      </div>
      <Follow :target-id="recomment.id" :request-id="userId" status="follow" id="" />
    </div>
  </RouterLink>
</template>
