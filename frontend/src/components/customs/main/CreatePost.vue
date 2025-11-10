<script setup lang="ts">
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import EmojiPicker from 'vue3-emoji-picker'
import type { UserInfo } from '@/types/user.type'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { onMounted, ref } from 'vue'
import { Plus, Smile } from 'lucide-vue-next'
import { CookieUtils } from '@/utils/cookie.util'
import { useUser } from '@/stores/user.store'
import { storeToRefs } from 'pinia'
import Upload from '../Common/file/Upload.vue'
defineProps({
  open: {
    type: Boolean,
    required: true,
  },
})
const account = CookieUtils.getObject<UserInfo>('account')
const userStore = useUser()
const { getInfo } = userStore
const { userInfo } = storeToRefs(userStore)
onMounted(() => {
  getInfo(account?.id as string)
})

const area = ref('')

const onSelectEmoji = (emoji: { i: string }) => {
  area.value += emoji.i
}
</script>
<template>
  <Dialog>
    <DialogTrigger as-child>
      <SidebarMenuButton
        class="bg-black text-gray-300 border-0 text-xl mb-2 w-[220px]"
        size="lg"
      >
        <div class="flex items-center justify-between gap-2 w-full">
          <div
            class="flex aspect-square size-8 items-center justify-center rounded-lg"
          >
            <component :is="Plus" class="size-6" />
          </div>
          <div v-if="open" class="grid flex-1 leading-tight text-left">
            <span class="truncate font-semibold"> Create </span>
          </div>
        </div>
      </SidebarMenuButton>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px] bg-gray-950">
      <h1 class="text-gray-200 text-center">Create new post</h1>

      <div class="flex items-start justify-start flex-col gap-3">
        <div class="flex gap-3 items-center">
          <Avatar class="h-6 w-6 rounded-full">
            <AvatarImage
              :src="userInfo?.avatar?.url ?? ''"
              :alt="userInfo?.username ?? ''"
            />
            <AvatarFallback class="rounded-lg"> CN </AvatarFallback>
          </Avatar>
          <div class="user-infor flex justify-start flex-col">
            <span class="font-bold text-md text-gray-100">{{
              userInfo?.username
            }}</span>
          </div>
        </div>
        <Textarea
          id="area"
          v-model="area"
          class="text-gray-300 border-gray-700 w-100"
          placeholder="Type your message here."
        />
        <div class="flex justify-between items-center w-100">
          <div class="text-gray-50">{{ area.length }}/2000</div>
          <div class="emoji-button-container">
            <Popover>
              <PopoverTrigger as-child>
                <Button class="bg-transparent text-gray-50">
                  <Smile />
                </Button>
              </PopoverTrigger>
              <PopoverContent class="bg-gray-950">
                <EmojiPicker
                  theme="dark"
                  :native="true"
                  @select="onSelectEmoji"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Upload upload-type="Post" class="w-100" />
      </div>
      <DialogFooter>
        <Button type="submit" class="bg-blue-600"> Create </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
<style>
.comment-wrapper {
  float: right;
  width: 100%;
  max-width: 500px;
}

.comment-input-area {
  display: flex;
  align-items: center;
  border-radius: 22px;
  padding: 8px 12px;
}

.comment-input-area input {
  flex-grow: 1;
  border: none;
  outline: none;
  background: none;
  font-size: 0.9rem;
}

.emoji-button-container {
  position: relative;
  margin-left: 8px;
}

.emoji-button {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0;
  display: flex;
  align-items: center;
}

.picker-container-right {
  position: absolute;
  z-index: 10;
  left: 100%;
  bottom: 0;
  margin-left: 10px;
}
</style>
