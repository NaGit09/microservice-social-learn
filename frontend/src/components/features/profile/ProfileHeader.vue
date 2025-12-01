<script setup lang="ts">
import { type UserInfo } from '@/types/user.type'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ref, watch } from 'vue'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import UploadAvatar from '../../common/file/UploadAvatar.vue'

const prop = defineProps<{
  totalFollowers: number,
  totalFollowing: number,
  userInfo: UserInfo
  totalPost: number
}>()

const dialog = ref(false)

const closeDialog = () => {
  dialog.value = false
  console.log("Dialog đã đóng");
}

watch(() => prop.userInfo,
  () => {
    console.log('update info !');

  }, { deep: true })

</script>

<template>
  <div class="flex items-center justify-center gap-3">
    <div class="avatar flex-none">
      <Dialog v-model:open="dialog">
        <DialogTrigger as-child>
          <Avatar class="size-35">
            <AvatarImage class="object-cover" :src="userInfo?.avatar.url || ''" :alt="userInfo?.username" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px] bg-white dark:bg-gray-900">
          <div class="grid gap-4">
            <UploadAvatar @close="closeDialog" />
            <Separator class="bg-gray-400" />

            <Button variant="outline" class="dark:text-red-400 border-none shadow-none">
              Gỡ ảnh hiện tại
            </Button>
            <Separator class="bg-gray-400" />

            <DialogClose as-child>
              <Button variant="outline" class="dark:text-white border-none shadow-none">
                Huỷ
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    <div class="flex-1">
      <div class="flex flex-col justify-start items-start gap-3 dark:text-gray-50">
        <span class="text-2xl font-bold">{{ userInfo?.username }}</span>
        <span>{{ userInfo?.fullname }}</span>
        <div class="flex gap-3 items-center text-sm">
          <span>{{ totalPost }} bài viết </span>
          <span>{{ totalFollowers }} người theo dõi</span>
          <span> Đang theo dõi {{ totalFollowing }} người dùng</span>
        </div>
        <!-- <span>{{ userInfo.bio }}</span> -->
      </div>
    </div>
  </div>
</template>
