<script setup lang="ts">
import { type PropType } from 'vue'
import { Bell, Home, Inbox, Search, User } from 'lucide-vue-next'
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu'

// @ts-ignore - Ignore missing type declarations for emoji picker CSS import
import 'vue3-emoji-picker/css'
import CreatePost from './CreatePost.vue'

defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  isMobile: {
    type: Boolean,
    required: true,
  },
  setOpen: {
    type: Function as PropType<(val: boolean) => void>,
    required: true,
  },
  handleDropdownTriggerClick: {
    type: Function as PropType<(e: MouseEvent) => void>,
    required: true,
  },
})
</script>

<template>
  <SidebarContent>
    <SidebarMenu class="pl-2">
      <SidebarMenuItem class="list-none">
        <SidebarMenuButton
          @click="setOpen(true)"
          class="border-0 text-xl mb-2 w-[220px] hover:bg-gray-200 dark:hover:bg-gray-600"
          size="lg"
        >
          <a
            href="/"
            class="flex items-center no-underline justify-between gap-2 w-full text-gray-900 dark:text-gray-200"
          >
            <div
              class="flex aspect-square size-8 items-center justify-center rounded-lg"
            >
              <component :is="Home" class="size-6" />
            </div>
            <div v-if="open" class="grid flex-1 leading-tight text-left">
              <span class="truncate font-thin"> Trang chủ </span>
            </div>
          </a>
        </SidebarMenuButton>

        <RouterLink to="/message" custom v-slot="{ navigate }">
          <SidebarMenuButton
            @click="navigate"
            class="border-0 text-xl mb-2 w-[220px] hover:bg-gray-200 dark:hover:bg-gray-600"
            size="lg"
          >
            <div
              class="flex items-center justify-between gap-2 w-full dark:text-gray-200"
            >
              <div
                class="flex aspect-square size-8 items-center justify-center rounded-lg"
              >
                <component :is="Inbox" class="size-6" />
              </div>
              <div v-if="open" class="grid flex-1 leading-tight text-left">
                <span class="truncate font-thin"> Tin nhắn </span>
              </div>
            </div>
          </SidebarMenuButton>
        </RouterLink>

        <RouterLink to="/profile" custom v-slot="{ navigate }">
          <SidebarMenuButton
            @click="navigate"
            class="border-0 text-xl mb-2 w-[220px] hover:bg-gray-200 dark:hover:bg-gray-600"
            size="lg"
          >
            <div
              class="flex items-center justify-between gap-2 w-full dark:text-gray-200"
            >
              <div
                class="flex aspect-square size-8 items-center justify-center rounded-lg"
              >
                <component :is="User" class="size-6" />
              </div>
              <div v-if="open" class="grid flex-1 leading-tight text-left">
                <span class="truncate font-thin"> Trang cá nhân </span>
              </div>
            </div>
          </SidebarMenuButton>
        </RouterLink>

        <DropdownMenu>
          <DropdownMenuTrigger as-child @click="handleDropdownTriggerClick">
            <SidebarMenuButton
              class="border-0 text-xl mb-2 w-[220px] hover:bg-gray-200 dark:hover:bg-gray-600"
              size="lg"
            >
              <div
                class="flex items-center justify-between gap-2 w-full dark:text-gray-200"
              >
                <div
                  class="flex aspect-square size-8 items-center justify-center rounded-lg"
                >
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

        <DropdownMenu>
          <DropdownMenuTrigger as-child @click="handleDropdownTriggerClick">
            <SidebarMenuButton
              class="border-0 text-xl mb-2 w-[220px] hover:bg-gray-200 dark:hover:bg-gray-600"
              size="lg"
            >
              <div
                class="flex items-center justify-between gap-2 w-full dark:text-gray-200"
              >
                <div
                  class="flex aspect-square size-8 items-center justify-center rounded-lg"
                >
                  <component :is="Bell" class="size-6" />
                </div>
                <div v-if="open" class="grid flex-1 leading-tight text-left">
                  <span class="truncate font-thin"> Thông báo </span>
                </div>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            class="w-[--reka-dropdown-menu-trigger-width] min-w-90 h-screen
            rounded-lg ml-5 bg-white dark:bg-black dark:text-gray-200"
            align="start"
            :side="isMobile ? 'bottom' : 'right'"
            :side-offset="4"
          >
            <div class="p-4">
              <p>Notification.</p>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <CreatePost :open="open" />
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarContent>
</template>
<style></style>
