<script setup lang="ts">
import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar'
import type { File } from '@/types/common/file'
import { computed } from 'vue'

const prop = defineProps<{
  actor?: {
    id: string
    username: string
    avatar: File
  } | null
  content: string
  entityType: string
  entityId: string
}>()

const url = computed(() => {
  return (prop.entityType === 'follow' && prop.actor?.id) ? `/profile/${prop.actor.id}` : '/'
})
</script>
<template>
  <RouterLink custom v-slot="{ navigate }" :to="url">
    <div
      @click="navigate"
      class="border border-zinc-150 dark:border-zinc-850 m-2 p-3 flex items-start gap-3 rounded-xl hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-all duration-200 cursor-pointer text-sm"
    >
      <div class="flex-shrink-0">
        <Avatar class="h-9 w-9 rounded-full ring-1 ring-zinc-100 dark:ring-zinc-800">
          <AvatarImage
            class="object-cover"
            :src="actor?.avatar?.url ?? ''"
            :alt="actor?.username ?? ''"
          />
          <AvatarFallback class="rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-xs font-semibold">
            {{ actor?.username?.substring(0, 2).toUpperCase() || 'US' }}
          </AvatarFallback>
        </Avatar>
      </div>
      <div class="flex-1 min-w-0 leading-snug">
        <span class="font-semibold text-zinc-900 dark:text-zinc-100 hover:text-primary transition-colors mr-1">
          {{ actor?.username || 'Hệ thống' }}
        </span>
        <span class="text-zinc-600 dark:text-zinc-350">
          {{ content }}
        </span>
      </div>
    </div>
  </RouterLink>
</template>
<style></style>
