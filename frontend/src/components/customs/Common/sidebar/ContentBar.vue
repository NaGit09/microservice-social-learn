<script setup lang="ts">
import { type PropType } from 'vue'
import { Home, Inbox, User } from 'lucide-vue-next'
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

// @ts-ignore - Ignore missing type declarations for emoji picker CSS import
import 'vue3-emoji-picker/css'
import CreatePost from './CreatePost.vue'
import DropDownNotify from './DropDownNotify.vue'
import DropDownSearch from './DropDownSearch.vue'
import { CookieUtils } from '@/utils/cookie.util'
import { useUserStore } from '@/stores/user.store'

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
const useUser = useUserStore()

const { ownerInfo } = useUser 

  const userId = ownerInfo
    ? ownerInfo.id
    : (CookieUtils.get('userId') as string)

</script>

<template>
  <SidebarContent>
    <SidebarMenu class="pl-2">
      <SidebarMenuItem class="list-none">
        <SidebarMenuButton @click="setOpen(true)"
          class="border-0 text-xl mb-2 w-[220px] hover:bg-gray-200 dark:hover:bg-gray-600" size="lg">
          <a href="/"
            class="flex items-center no-underline justify-between gap-2 w-full text-gray-900 dark:text-gray-200">
            <div class="flex aspect-square size-8 items-center justify-center rounded-lg">
              <component :is="Home" class="size-6" />
            </div>
            <div v-if="open" class="grid flex-1 leading-tight text-left">
              <span class="truncate font-thin"> Trang chủ </span>
            </div>
          </a>
        </SidebarMenuButton>

        <RouterLink to="/message" custom v-slot="{ navigate }">
          <SidebarMenuButton @click="navigate"
            class="border-0 text-xl mb-2 w-[220px] hover:bg-gray-200 dark:hover:bg-gray-600" size="lg">
            <div class="flex items-center justify-between gap-2 w-full dark:text-gray-200">
              <div class="flex aspect-square size-8 items-center justify-center rounded-lg">
                <component :is="Inbox" class="size-6" />
              </div>
              <div v-if="open" class="grid flex-1 leading-tight text-left">
                <span class="truncate font-thin"> Tin nhắn </span>
              </div>
            </div>
          </SidebarMenuButton>
        </RouterLink>

        <RouterLink
          :to="`/profile/${userId}`"
          custom
          v-slot="{ navigate }"
        >
          <SidebarMenuButton @click="navigate"
            class="border-0 text-xl mb-2 w-[220px] hover:bg-gray-200 dark:hover:bg-gray-600" size="lg">
            <div class="flex items-center justify-between gap-2 w-full dark:text-gray-200">
              <div class="flex aspect-square size-8 items-center justify-center rounded-lg">
                <component :is="User" class="size-6" />
              </div>
              <div v-if="open" class="grid flex-1 leading-tight text-left">
                <span class="truncate font-thin"> Trang cá nhân </span>
              </div>
            </div>
          </SidebarMenuButton>
        </RouterLink>

        <DropDownSearch :handle-dropdown-trigger-click="handleDropdownTriggerClick" :isMobile="isMobile" :open="open" />

        <DropDownNotify :user-id="userId || ''" :handle-dropdown-trigger-click="handleDropdownTriggerClick"
          :isMobile="isMobile" :open="open" />

        <CreatePost :open="open" />
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarContent>
</template>
<style></style>
