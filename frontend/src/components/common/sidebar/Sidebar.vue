<script setup lang="ts">
import { Sidebar, useSidebar, type SidebarProps } from '@/components/ui/sidebar'
import HeaderBar from './HeaderBar.vue'
import ContentBar from './ContentBar.vue'
import UserBar from './UserBar.vue'
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
})
const closeList = ['message', 'suggestions']
const { open, isMobile, setOpen } = useSidebar()
const route = useRoute()

const isMessageScreen = computed(() => closeList.includes(route.name as string))

onMounted(() => {
  open.value = !isMessageScreen.value
})

function handleDropdownTriggerClick(event: MouseEvent) {
  if (open.value) {
    event.preventDefault()
    setOpen(!open.value)
  }
}
</script>

<template>
  <Sidebar
    class="border-gray-300 border-r-1 bg-white dark:bg-black min-w-[55px]"
    v-bind="props"
  >
    <HeaderBar :set-open="setOpen" :open="open" />
    <ContentBar
      :open="open"
      :is-mobile="isMobile"
      :set-open="setOpen"
      :handle-dropdown-trigger-click="handleDropdownTriggerClick"
    />
    <UserBar />
  </Sidebar>
</template>
