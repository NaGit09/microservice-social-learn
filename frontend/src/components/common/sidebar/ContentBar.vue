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
import DropDownSearch from './DropDownSearch.vue'
import DropDownNotify from './DropDownNotify.vue'
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
  activePanel: {
    type: String as PropType<'search' | 'notifications' | null>,
    default: null,
  },
})

const emit = defineEmits<{
  (e: 'update:activePanel', value: 'search' | 'notifications' | null): void
}>()

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
  <SidebarContent class="overflow-x-hidden">
    <SidebarMenu class="pl-2 pr-2 mt-4">
      <SidebarMenuItem class="list-none flex flex-col gap-1">
        <template v-for="item in menuItems" :key="item.route">
          <RouterLink :to="item.route" custom v-slot="{ href, navigate, isActive }">
            <a :href="href" @click="navigate" class="w-full block no-underline">
              <SidebarMenuButton 
                as="div"
                class="group border-0 text-xl w-[220px] bg-transparent transition-all duration-300 ease-in-out rounded-xl cursor-pointer" 
                size="lg"
                :class="{ 'font-semibold text-primary': isActive }"
              >
                <div class="flex items-center justify-between gap-2 w-full text-zinc-700 dark:text-zinc-300">
                  <div class="flex aspect-square size-8 items-center justify-center rounded-lg">
                    <component 
                      :is="item.icon" 
                      class="size-6 transition-transform duration-300 ease-in-out group-hover:scale-110"
                      :class="{ 'stroke-[2.5px] text-primary': isActive }"
                    />
                  </div>
                  <div :class="[
                    'transition-all duration-300 ease-in-out flex-1 leading-tight text-left',
                    open ? 'opacity-100 max-w-[200px] translate-x-0 ml-2' : 'opacity-0 max-w-0 -translate-x-4 overflow-hidden pointer-events-none'
                  ]">
                    <span class="truncate font-normal text-[15px]"> {{ item.label }} </span>
                  </div>
                </div>
              </SidebarMenuButton>
            </a>
          </RouterLink>
        </template>

        <DropDownSearch 
          :active-panel="activePanel"
          @update:active-panel="emit('update:activePanel', $event)"
          :isMobile="isMobile" 
          :open="open" 
        />

        <DropDownNotify 
          :user-id="userId || ''" 
          :active-panel="activePanel"
          @update:active-panel="emit('update:activePanel', $event)"
          :isMobile="isMobile" 
          :open="open" 
        />

        <CreatePost :open="open" />
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarContent>
</template>

<style></style>
