<script setup lang="ts">
import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import type { File } from '@/types/common/file'
import { computed } from 'vue'

const prop = defineProps<{
  actor: {
    id: string
    username: string
    avatar: File
  }
  content: string
  entityType: string
  entityId: string
}>()

const url = computed(() => {
  return prop.entityType === 'follow' ? `/profile/${prop.actor.id}` : '/'
})
</script>
<template>
  <RouterLink custom v-slot="{ navigate }" :to="url">
    <DropdownMenuItem
      @click="navigate"
      class="border-1 border-gray-400 m-2 p-2 flex items-start"
    >
      <div class="flex gap-3 items-center">
        <Avatar class="h-8 w-8 rounded-full">
          <AvatarImage
            class="object-cover"
            :src="actor?.avatar?.url ?? ''"
            :alt="actor?.username ?? ''"
          />
          <AvatarFallback class="rounded-lg dark:bg-gray-500">
            CN
          </AvatarFallback>
        </Avatar>
      </div>
      <span class="max-w-[250px]">
        <span class="font-bold text-md dark:text-gray-50 pr-2">{{
          actor?.username
        }}</span>

        <span> {{ content }} </span>
      </span>
    </DropdownMenuItem>
  </RouterLink>
</template>
<style></style>
