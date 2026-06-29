<script setup lang="ts">
import { Sidebar, useSidebar, type SidebarProps } from '@/components/ui/sidebar'
import HeaderBar from './HeaderBar.vue'
import ContentBar from './ContentBar.vue'
import UserBar from './UserBar.vue'
import { onMounted, computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { onClickOutside } from '@vueuse/core'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
})
const closeList = ['message', 'suggestions']
const { open, isMobile, setOpen } = useSidebar()
const route = useRoute()

const isMessageScreen = computed(() => closeList.includes(route.name as string))

const activePanel = ref<'search' | 'notifications' | null>(null)
const sidebarWrapperRef = ref<HTMLElement | null>(null)

// Watch route to close panel when navigating
watch(() => route.path, () => {
  activePanel.value = null
  if (!isMessageScreen.value) {
    setOpen(true)
  }
})

// Close panel when clicking outside
onClickOutside(sidebarWrapperRef, () => {
  if (activePanel.value) {
    activePanel.value = null
    if (!isMessageScreen.value) {
      setOpen(true)
    }
  }
})

onMounted(() => {
  open.value = !isMessageScreen.value
})

function handlePanelChange(panel: 'search' | 'notifications' | null) {
  activePanel.value = panel
  if (panel) {
    setOpen(false) // Collapse sidebar when panel is open
  } else {
    if (!isMessageScreen.value) {
      setOpen(true) // Expand sidebar if not on message screen
    }
  }
}
</script>

<template>
  <div ref="sidebarWrapperRef" class="relative flex h-full">
    <Sidebar
      class="border-gray-200 dark:border-zinc-900 border-r bg-white dark:bg-black min-w-[55px] z-40"
      v-bind="props"
    >
      <HeaderBar :open="open" />
      <ContentBar
        :open="open"
        :is-mobile="isMobile"
        :set-open="setOpen"
        :active-panel="activePanel"
        @update:active-panel="handlePanelChange"
      />
      <UserBar :open="open" />
    </Sidebar>
  </div>
</template>

<style scoped>
/* Inject premium cubic-bezier transitions for sidebar expand/collapse */
:deep(.peer),
:deep([data-sidebar="sidebar"]),
:deep(.fixed) {
  transition-property: all !important;
  transition-duration: 350ms !important;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important;
}
</style>

