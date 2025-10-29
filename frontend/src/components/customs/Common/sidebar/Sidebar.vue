<script setup lang="ts">
import {
  Sidebar,
  useSidebar,
  type SidebarProps,
} from '@/components/ui/sidebar'
import HeaderBar from './HeaderBar.vue';
import ContentBar from './ContentBar.vue';
import UserBar from './UserBar.vue';


const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
})

const { open, isMobile, setOpen } = useSidebar()

function handleDropdownTriggerClick(event: MouseEvent) {
  if (open.value) {
    event.preventDefault()
    setOpen(!open.value)
  }
}
</script>
<template>
  <Sidebar v-bind="props">
    <HeaderBar @click="setOpen(!open)" :open="open" />
    <ContentBar
      :open="open"
      :is-mobile="isMobile"
      :set-open="setOpen"
      :handle-dropdown-trigger-click="handleDropdownTriggerClick"
    />
    />
    <UserBar />
  </Sidebar>
</template>
