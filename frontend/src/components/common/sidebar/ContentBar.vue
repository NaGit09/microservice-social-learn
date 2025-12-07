<script setup lang="ts">
import { type PropType, computed } from 'vue'
import { Home, Inbox, User, Sparkles } from 'lucide-vue-next'
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
import { storeToRefs } from 'pinia'

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
const { ownerInfo } = storeToRefs(useUser)

const userId = computed(() => {
  return ownerInfo.value?.id || (CookieUtils.get('userId') as string)
})

const menuItems = computed(() => [
  {
    label: 'Trang chủ',
    icon: Home,
    route: '/',
  },
  {
    label: 'Tin nhắn',
    icon: Inbox,
    route: '/message',
  },
  {
    label: 'Gợi ý',
    icon: Sparkles,
    route: '/suggestions',
  },
  {
    label: 'Trang cá nhân',
    icon: User,
    route: `/profile/${userId.value}`,
  },
])
</script>

<template>
  <SidebarContent>
    <SidebarMenu class="pl-2">
      <SidebarMenuItem class="list-none">

        <template v-for="item in menuItems" :key="item.route">
          <RouterLink :to="item.route" custom v-slot="{ navigate, href, isActive }">
            <SidebarMenuButton @click="navigate"
              class="border-0 text-xl mb-2 w-[220px] hover:bg-gray-200 dark:hover:bg-gray-600" size="lg"
              :class="{ 'bg-gray-200 dark:bg-gray-700': isActive }">
              <div class="flex items-center justify-between gap-2 w-full dark:text-gray-200">
                <div class="flex aspect-square size-8 items-center justify-center rounded-lg">
                  <component :is="item.icon" class="size-6" />
                </div>
                <div v-if="open" class="grid flex-1 leading-tight text-left">
                  <span class="truncate font-thin"> {{ item.label }} </span>
                </div>
              </div>
            </SidebarMenuButton>
          </RouterLink>
        </template>

        <DropDownSearch :handle-dropdown-trigger-click="handleDropdownTriggerClick" :isMobile="isMobile" :open="open" />

        <DropDownNotify :user-id="userId || ''" :handle-dropdown-trigger-click="handleDropdownTriggerClick"
          :isMobile="isMobile" :open="open" />

        <CreatePost :open="open" />
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarContent>
</template>
<style></style>
