<script setup lang="ts">
import { Avatar, AvatarImage } from '@/components/ui/avatar'

import { DEFAULT_AVATAR } from '@/constant/default.constant'
defineProps({
  ownerInfo: {
    type: Object,
    default: null,
  },
})
</script>

<template>
  <template v-if="ownerInfo">
    <Avatar class="h-8 w-8 rounded-lg">
      <AvatarImage
        class="object-cover"
        :src="ownerInfo.avatar?.url"
        :alt="ownerInfo.username ?? ''"
      />
    </Avatar>
    <div class="grid flex-1 text-left text-xl leading-tight">
      <span class="truncate font-thin dark:text-gray-200">{{
        ownerInfo.fullname
      }}</span>
    </div>
  </template>

  <template v-else>
    <Avatar class="h-8 w-8 rounded-lg">
      <AvatarImage
        class="object-cover"
        :src="DEFAULT_AVATAR"
        alt="default avatar"
      />
    </Avatar>
    <div class="grid flex-1 text-left text-xl leading-tight">
      <span class="truncate font-semibold animate-pulse rounded w-3/4 h-5"
        >&nbsp;</span
      >
    </div>
  </template>
</template>
