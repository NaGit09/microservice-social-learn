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
  <div class="flex items-center justify-between py-2 px-3 w-full">
    <div class="flex gap-3 items-center">
      <Avatar class="h-8 w-8 rounded-full ring-2 ring-transparent transition-all duration-300 hover:ring-primary/20">
        <AvatarImage class="object-cover" :src="userInfo?.avatar?.url ?? ''" :alt="userInfo?.username ?? ''" />
        <AvatarFallback class="rounded-full bg-primary/10 text-primary text-xs font-bold">
          {{ userInfo?.username?.substring(0, 2).toUpperCase() || 'U' }}
        </AvatarFallback>
      </Avatar>
      <div class="user-infor flex flex-col justify-center">
        <span class="font-semibold text-sm text-zinc-800 dark:text-zinc-200 hover:text-primary cursor-pointer transition-colors">
          {{ userInfo?.username }}
        </span>
      </div>
    </div>
    <div class="Function flex items-center">
      <Dialog>
        <DialogTrigger as-child>
          <Button class="p-1.5 h-8 w-8 rounded-full hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-all cursor-pointer bg-transparent shadow-none border-none">
            <Ellipsis class="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent class="bg-card sm:max-w-[320px] p-0 rounded-2xl overflow-hidden border border-border shadow-2xl">
          <div class="flex flex-col w-full text-center">
            <button v-if="checkAuthor" class="w-full py-3.5 text-sm font-semibold text-red-600 hover:bg-red-500/10 border-b border-border transition-colors">
              Delete Post
            </button>
            <button class="w-full py-3.5 text-sm font-semibold text-red-600 hover:bg-red-500/10 border-b border-border transition-colors">
              Report Post
            </button>
            <button class="w-full py-3.5 text-sm font-semibold text-red-600 hover:bg-red-500/10 border-b border-border transition-colors">
              Unfollow User
            </button>
            <button class="w-full py-3.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 border-b border-border transition-colors">
              Copy Link
            </button>
            <button class="w-full py-3.5 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors">
              Cancel
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  </div>
</template>

<style scoped>
button {
  background: transparent;
  border: none;
  cursor: pointer;
  outline: none;
}
</style>
