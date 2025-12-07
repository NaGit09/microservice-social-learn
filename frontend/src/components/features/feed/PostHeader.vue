<script setup lang="ts">
import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar'
import { Ellipsis } from 'lucide-vue-next'
import { getUserInfoApi } from '@/services/api/user.api'
import type { UserInfo } from '@/types/user.type'
import { computed, onMounted, ref } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const userId = defineProps({
  authorId: String,
  ownerId: String,
})
const checkAuthor = computed(() => {
  return userId.authorId === userId.ownerId
})
const userInfo = ref<UserInfo>()
onMounted(async () => {
  userInfo.value = await getUserInfoApi(userId.authorId as string)
})
</script>
<template>
  <div class="flex items-center justify-between p-2">
    <div class="flex gap-3 items-center">
      <Avatar class="h-8 w-8 rounded-full">
        <AvatarImage class="object-cover" :src="userInfo?.avatar?.url ?? ''" :alt="userInfo?.username ?? ''" />
        <AvatarFallback class="rounded-lg  dark:bg-gray-500"> CN </AvatarFallback>
      </Avatar>
      <div class="user-infor flex justify-center flex-col">
        <span class="font-bold text-md dark:text-gray-50">{{ userInfo?.username }}</span>
      </div>
    </div>
    <div class="Funtion">
      <Dialog>
        <DialogTrigger as-child>
          <Ellipsis class="dark:text-gray-50" />
        </DialogTrigger>
        <DialogContent class="bg-gray-500 sm:max-w-[350px] p-0 rounded-lg">
          <Button v-if="checkAuthor" class="ins-btn text-red-600">Delete</Button>
          <Separator class="bg-gray-200 overflow-hidden" />

          <Button class="ins-btn text-red-600">Report</Button>
          <Separator class="bg-gray-200 overflow-hidden" />

          <Button class="ins-btn text-red-600">Unfollow</Button>
          <Separator class="bg-gray-200 overflow-hidden" />

          <Button class="ins-btn text-gray-50">Copy url link</Button>
          <Separator class="bg-gray-200 overflow-hidden" />

          <Button class="ins-btn text-gray-50 mb-2">Cancel</Button>
        </DialogContent>
      </Dialog>
    </div>
  </div>
</template>
<style>
 
button , .ins-btn {
  background:  transparent;
  border: none;
  font-weight: bold;
  cursor: pointer;
}
</style>
