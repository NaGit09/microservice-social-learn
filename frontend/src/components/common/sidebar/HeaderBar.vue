<script setup lang="ts">
import { SidebarHeader } from '@/components/ui/sidebar'
import { Orbit } from 'lucide-vue-next'

defineProps({
  open: {
    type: Boolean,
    required: true,
  },
})
</script>

<template>
  <!-- Sidebar header logo -->
  <SidebarHeader class="h-16 flex items-center justify-start px-3 overflow-hidden border-none mt-2">
    <div class="relative w-full h-10 flex items-center">
      <!-- Icon Logo (visible when collapsed) -->
      <div 
        :class="[
          'absolute left-1 flex aspect-square size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-600 text-white shadow-lg shadow-primary/20 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer hover:rotate-12',
          open ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100'
        ]"
      >
        <Orbit class="size-5" />
      </div>
      
      <!-- Text Logo (visible when open) -->
      <div 
        :class="[
          'absolute left-1 flex items-center gap-2 text-2xl font-black tracking-tight transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] whitespace-nowrap cursor-pointer',
          open ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
        ]"
      >
        <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-indigo-600 text-white">
          <Orbit class="size-4" />
        </div>
        <span class="bg-gradient-to-r from-primary to-indigo-500 dark:from-primary dark:to-indigo-300 bg-clip-text text-transparent font-extrabold italic">
          SocialLearn
        </span>
      </div>
    </div>
  </SidebarHeader>
</template>

