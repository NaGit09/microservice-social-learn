<script setup lang="ts">
import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar'
import { Ellipsis } from 'lucide-vue-next'
import { getUserInfo } from '@/services/api/user.api'
import type { UserInfo } from '@/types/user.type'
import { onMounted, ref } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
const userId = defineProps({
  authorId: String,
})

const userInfo = ref<UserInfo>()
onMounted(async () => {
  userInfo.value = await getUserInfo(userId.authorId as string)
})
</script>
<template>
  <div class="flex items-center justify-between p-2">
    <div class="flex gap-3 items-center">
      <Avatar class="h-8 w-8 rounded-full">
        <AvatarImage
          :src="userInfo?.avatar?.url ?? ''"
          :alt="userInfo?.username ?? ''"
        />
        <AvatarFallback class="rounded-lg  dark:bg-gray-500"> CN </AvatarFallback>
      </Avatar>
      <div class="user-infor flex justify-center flex-col">
        <span class="font-bold text-md dark:text-gray-50">{{ userInfo?.username }}</span>
      </div>
    </div>
    <div class="Funtion">
      <Dialog class="">
        <DialogTrigger as-child>
          <Ellipsis />
        </DialogTrigger>
        <DialogContent class="bg-gray-950 sm:max-w-[350px] p-0 rounded-lg">
          <Separator />

          <Button class="ins-btn text-red-600">Report</Button>
          <Separator />

          <Button class="ins-btn text-red-600">Unfollow</Button>
          <Separator />

          <Button class="ins-btn">Copy url link</Button>
          <Separator />

          <Button class="ins-btn">Cancel</Button>
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
