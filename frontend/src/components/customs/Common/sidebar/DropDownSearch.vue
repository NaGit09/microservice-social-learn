<!-- SCRIPT -->
<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { Search } from 'lucide-vue-next'

defineProps<{
  open: boolean
  isMobile: boolean
  handleDropdownTriggerClick: (e: MouseEvent) => void
}>()
</script>
<!-- TEMPLATE -->
<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child @click="handleDropdownTriggerClick">
      <SidebarMenuButton
        class="border-0 text-xl mb-2 w-[220px] 
        hover:bg-gray-200 dark:hover:bg-gray-600"
        size="lg">
        <div class="flex items-center justify-between gap-2 w-full dark:text-gray-200" >
          <div class="flex aspect-square size-8 items-center justify-center rounded-lg">
            <component :is="Search" class="size-6" />
          </div>
          <div v-if="open" class="grid flex-1 leading-tight text-left">
            <span class="truncate font-thin"> Tìm kiếm </span>
          </div>
        </div>
      </SidebarMenuButton>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      class="w-[--reka-dropdown-menu-trigger-width] min-w-90 h-screen rounded-lg 
      ml-5 bg-white dark:bg-black dark:text-gray-200"
      align="start"
      :side="isMobile ? 'bottom' : 'right'"
      :side-offset="4"
    >
      <div class="p-4">
        <p>Nội dung tìm kiếm...</p>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
<style></style>
