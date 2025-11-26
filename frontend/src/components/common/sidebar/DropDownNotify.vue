<!-- SCRIPT -->
<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { useNotificatonStore } from '@/stores/notification.store'
import { Bell } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed, onMounted, watch } from 'vue'
import UserNotification from './UserNotification.vue'

const prop = defineProps<{
  userId: string
  open: boolean
  isMobile: boolean
  handleDropdownTriggerClick: (e: MouseEvent) => void
}>()

const useNotification = useNotificatonStore()
const { GetNotify } = useNotification
const { notifications } = storeToRefs(useNotification)

const notificationFilter = computed(() => {
  return notifications.value?.filter((n) => n.actor.id !== prop.userId)
})

onMounted(async () => {
  await GetNotify(prop.userId)
})

</script>
<!-- TEMPLATE -->
<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child @click="handleDropdownTriggerClick">
      <SidebarMenuButton class="border-0 text-xl mb-2 w-[220px] hover:bg-gray-200 dark:hover:bg-gray-600" size="lg">
        <div class="flex items-center justify-between gap-2 w-full dark:text-gray-200">
          <div class="flex aspect-square size-8 items-center justify-center rounded-lg">
            <component :is="Bell" class="size-6" />
          </div>
          <div v-if="open" class="grid flex-1 leading-tight text-left">
            <span class="truncate font-thin"> Thông báo </span>
          </div>
        </div>
      </SidebarMenuButton>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-[--reka-dropdown-menu-trigger-width] min-w-90 h-screen rounded-lg ml-5
       bg-white dark:bg-black dark:text-gray-200" align="start" :side="isMobile ? 'bottom' : 'right'" :side-offset="4">
      <div class="p-4">
        <p>Notification.</p>
        <div class="notifications">
          <UserNotification v-for="value in notificationFilter" :key="value._id" :actor="value.actor"
            :content="value.metadata.Content" :entityType="value.entityType" :entityId="value?.entityId || ''" />
        </div>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style></style>
