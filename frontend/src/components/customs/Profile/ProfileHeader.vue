<script setup lang="ts">
import { type UserInfo } from '@/types/user.type'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useFollowStore } from '@/stores/follow.store'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
const prop = defineProps<{
  ownerInfo: UserInfo,
  totalPost : Number,
}>()
const useFollow = useFollowStore()
const { getTotalUserFollowers, getTotalUserFollowing } = useFollow
const { totalFollowers, totalFollowing } = storeToRefs(useFollow)
onMounted(() => {
  getTotalUserFollowers(prop.ownerInfo.id || '')
  getTotalUserFollowing(prop.ownerInfo?.id || '')
})
</script>
<template>
  <div class="flex items-center justify-center gap-3">
    <div class="avatar flex-none">
      <Avatar class="size-35">
        <AvatarImage
          :src="ownerInfo?.avatar.url || ''"
          :alt="ownerInfo?.username"
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
    <div class="flex-1">
      <div
        class="flex flex-col justify-start items-start gap-3 dark:text-gray-50"
      >
        <span class="text-2xl font-bold">{{ ownerInfo?.username }}</span>
        <span>{{ ownerInfo?.fullname }}</span>
        <div class="flex gap-3 items-center text-sm">
          <span>{{ totalPost }} bài viết </span>
          <span>{{ totalFollowers }} người theo dõi</span>
          <span> Đang theo dõi {{ totalFollowing }} người dùng</span>
        </div>
        <span>No pain no gain 🔥</span>
      </div>
    </div>
  </div>
</template>
