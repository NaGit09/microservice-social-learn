<script setup lang="ts">
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useUserStore } from '@/stores/user.store'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import UserRecommend from './UserRecommend.vue'
import RecommentFooter from './RecommentFooter.vue'

const prop = defineProps<{
  userId: string
}>()
const userStore = useUserStore()
const { userRecommend, ownerInfo } = storeToRefs(userStore)
const filterRecommend = computed(() => {
  return userRecommend.value?.filter((u) => u.id !== prop.userId)
})
</script>

<template>
  <div class="flex gap-3 flex-col mt-5 mr-4 flex-none">
    <div class="container flex items-center justify-between gap-3 mb-3 mt-5">
      <div class="flex items-center gap-4">
        <Avatar class="h-10 w-10 rounded-full">
          <AvatarImage
            class="object-cover"
            :src="ownerInfo?.avatar?.url ?? ''"
            :alt="ownerInfo?.username ?? ''"
          />
          <AvatarFallback class="rounded-lg"> CN </AvatarFallback>
        </Avatar>
        <div class="user-infor flex flex-col">
          <span class="text-xl dark:text-gray-200 text-boid">{{
            ownerInfo?.username
          }}</span>
          <span class="text-gray-400">{{ ownerInfo?.fullname }}</span>
        </div>
      </div>
      <RouterLink
        class="no-underline text-blue-400 font-bold text-sm"
        to="/login"
        >Transfer</RouterLink
      >
    </div>
    <div class="flex items-center justify-between">
      <span class="text-gray-500 font-bold">Suggestions for you</span>
      <RouterLink class="no-underline text-gray-300 font-bold" to="/suggestions"
        >View all</RouterLink
      >
    </div>
    <div class="w-full">
      <ul
        class="list-none flex items-start flex-col px-0"
        v-if="Array.isArray(userRecommend) && userRecommend.length > 0"
      >
        <li class="w-full m-1" v-for="user in filterRecommend">
          <UserRecommend v-bind="user" />
        </li>
      </ul>
      <div class="" v-else>Not user recommend</div>
    </div>
    <RecommentFooter />
  </div>
</template>
