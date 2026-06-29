<script setup lang="ts">
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { useNotificatonStore } from '@/stores/notification.store'
import { Bell } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import UserNotification from './UserNotification.vue'

const props = defineProps<{
  userId: string
  activePanel: 'search' | 'notifications' | null
  isMobile: boolean
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:activePanel', value: 'search' | 'notifications' | null): void
}>()

const useNotification = useNotificatonStore()
const { GetNotify } = useNotification
const { notifications } = storeToRefs(useNotification)

const notificationFilter = computed(() => {
  return notifications.value?.filter((n) => n.actor?.id !== props.userId)
})

onMounted(async () => {
  if (props.userId) {
    await GetNotify(props.userId)
  }
})

const togglePanel = () => {
  if (props.activePanel === 'notifications') {
    emit('update:activePanel', null)
  } else {
    emit('update:activePanel', 'notifications')
  }
}

const closePanel = () => {
  emit('update:activePanel', null)
}
</script>

<template>
  <div class="relative">
    <!-- Trigger Button -->
    <SidebarMenuButton 
      @click="togglePanel"
      class="group border-0 text-xl w-[220px] bg-transparent transition-all duration-300 ease-in-out rounded-xl" 
      size="lg"
      :class="{ 'font-semibold text-primary': activePanel === 'notifications' }"
    >
      <div class="flex items-center justify-between gap-2 w-full text-zinc-700 dark:text-zinc-300">
        <div class="flex aspect-square size-8 items-center justify-center rounded-lg">
          <Bell 
            class="size-6 transition-transform duration-300 group-hover:scale-110"
            :class="{ 'stroke-[2.5px] text-primary': activePanel === 'notifications' }"
          />
        </div>
        <div :class="[
          'transition-all duration-300 ease-in-out flex-1 leading-tight text-left',
          open ? 'opacity-100 max-w-[200px] translate-x-0 ml-2' : 'opacity-0 max-w-0 -translate-x-4 overflow-hidden pointer-events-none'
        ]">
          <span class="truncate font-normal text-[15px]"> Thông báo </span>
        </div>
      </div>
    </SidebarMenuButton>

    <!-- Backdrop (Mobile only) -->
    <div 
      v-if="isMobile && activePanel === 'notifications'"
      @click="closePanel"
      class="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
    />

    <!-- Slide-out Panel / Bottom Sheet -->
    <div 
      :class="[
        // Base styles
        'fixed bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-900 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col shadow-2xl z-50',
        // Desktop vs Mobile Layout & Animations
        isMobile 
          ? 'bottom-0 left-0 right-0 h-[75vh] rounded-t-3xl border-t ' + (activePanel === 'notifications' ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none')
          : 'top-0 bottom-0 left-[55px] w-[397px] border-r rounded-none ' + (activePanel === 'notifications' ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none')
      ]"
    >
      <div class="p-6 flex flex-col gap-4 h-full">
        <div>
          <h2 class="text-2xl font-bold tracking-tight mb-2 dark:text-white">Thông báo</h2>
        </div>

        <!-- Divider -->
        <div class="h-[1px] bg-gray-100 dark:bg-zinc-900 -mx-6 my-2" />

        <div class="flex-1 overflow-y-auto pr-1">
          <div v-if="notificationFilter && notificationFilter.length > 0" class="flex flex-col gap-1">
            <UserNotification 
              v-for="value in notificationFilter" 
              :key="value._id" 
              :actor="value.actor"
              :content="value.metadata.Content" 
              :entityType="value.entityType" 
              :entityId="value?.entityId || ''" 
              @click="closePanel"
            />
          </div>
          <div v-else class="text-center text-gray-450 py-12 text-sm flex flex-col items-center gap-3">
            <div class="bg-gray-100 dark:bg-zinc-900 p-4 rounded-full">
              <Bell class="size-8 text-gray-400 dark:text-zinc-600" />
            </div>
            <span>Chưa có thông báo mới.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

