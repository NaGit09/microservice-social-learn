<script setup lang="ts">
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Search } from 'lucide-vue-next'
import type { PropType } from 'vue';

defineProps({
    open: {
        type: Boolean,
        required: true,
    },

    setOpen: {
        type: Function as PropType<(val: boolean) => void>,
        required: true,
    },

});

</script>
<template>
  <!-- Sidebar header logo -->
  <SidebarHeader>
    <SidebarMenu class="p-0">
      <SidebarMenuItem>
        <SidebarMenuButton
          class="border-0"
          size="lg"
        >
          <div
            v-if="!open"
            class="flex aspect-square size-8 items-center justify-center rounded-lg"
          >
            <component :is="Search" class="size-6" />
          </div>
          <div
            v-else
            class="grid flex-1 text-left text-3xl italic leading-tight"
          >
            <span class="truncate font-semibold dark:text-gray-200"> Social learn </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarHeader>
</template>
