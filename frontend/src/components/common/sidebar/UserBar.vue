<script setup lang="ts">
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { SidebarFooter, SidebarMenuButton } from '@/components/ui/sidebar'
import { Switch } from '@/components/ui/switch'
import { router } from '@/router'
import { useAuthStore } from '@/stores/auth.store'
import { useUserStore } from '@/stores/user.store'
import { useColorMode } from '@vueuse/core'
import { Sun, Moon } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

defineProps<{
  open: boolean
}>()

const { logout } = useAuthStore()
const defaultAvatar = import.meta.env.VITE_DEFAULT_AVATAR ?? ''

const useUser = useUserStore()
const { ownerInfo } = storeToRefs(useUser)

const mode = useColorMode()
const isDark = computed({
  get: () => mode.value === 'dark',
  set: (val) => {
    mode.value = val ? 'dark' : 'light'
  },
})

const handleSwitch = () => {
  isDark.value = !isDark.value
}

const handleLogout = async () => {
  const logouted = await logout(ownerInfo?.value?.id as string)
  if (logouted) {
    router.push('/login')
    return
  }
  console.log(logouted)
}
</script>

<template>
  <SidebarFooter class="p-2 border-none">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <SidebarMenuButton 
          class="group border-0 text-xl w-[220px] bg-transparent transition-all duration-300 ease-in-out rounded-xl" 
          size="lg"
        >
          <template v-if="ownerInfo">
            <Avatar class="h-8 w-8 rounded-full ring-2 ring-gray-100 dark:ring-zinc-800 transition-transform duration-300 group-hover:scale-105">
              <AvatarImage class="object-cover" :src="ownerInfo.avatar?.url ?? defaultAvatar"
                :alt="ownerInfo.username ?? ''" />
              <AvatarFallback
                class="rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground font-bold">
                {{ ownerInfo.fullname?.[0]?.toUpperCase() ?? 'U' }}
              </AvatarFallback>
            </Avatar>
            <div :class="[
              'transition-all duration-300 ease-in-out grid flex-1 text-left text-xl leading-tight',
              open ? 'opacity-100 max-w-[150px] translate-x-0 ml-2' : 'opacity-0 max-w-0 -translate-x-4 overflow-hidden pointer-events-none'
            ]">
              <span class="truncate font-normal text-[15px] dark:text-zinc-200">{{ ownerInfo.fullname }}</span>
            </div>
          </template>

          <template v-else>
            <Avatar class="h-8 w-8 rounded-full animate-pulse bg-gray-200 dark:bg-zinc-800" />
            <div :class="[
              'transition-all duration-300 ease-in-out grid flex-1 text-left text-xl leading-tight',
              open ? 'opacity-100 max-w-[150px] translate-x-0 ml-2' : 'opacity-0 max-w-0 -translate-x-4 overflow-hidden pointer-events-none'
            ]">
              <span class="truncate font-semibold animate-pulse rounded bg-gray-200 dark:bg-zinc-800 w-3/4 h-4">&nbsp;</span>
            </div>
          </template>
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        class="w-56 bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-1.5 shadow-xl"
        align="start"
        side="right"
        :side-offset="12"
      >
        <DropdownMenuLabel class="dark:text-zinc-400 text-xs font-semibold px-2.5 py-1.5">Tài khoản của tôi</DropdownMenuLabel>
        <DropdownMenuSeparator class="bg-gray-100 dark:bg-zinc-900 my-1" />
        <DropdownMenuItem
          class="flex items-center justify-between dark:text-zinc-200 focus:bg-gray-50 dark:focus:bg-zinc-900 rounded-lg px-2.5 py-2 cursor-pointer transition-colors"
          @select.prevent
        >
          <div class="flex items-center gap-2 w-full" @click.stop="handleSwitch">
            <span class="text-sm font-medium">{{ isDark ? 'Chế độ tối' : 'Chế độ sáng' }}</span>
          </div>
          <Switch 
            :model-value="isDark" 
            @update:model-value="isDark = $event"
            class="w-9 h-5 data-[state=checked]:bg-primary"
          >
            <template #thumb>
              <div class="flex items-center justify-center w-full h-full">
                <Moon v-if="isDark" class="w-3 h-3 text-primary" />
                <Sun v-else class="w-3 h-3 text-yellow-500" />
              </div>
            </template>
          </Switch>
        </DropdownMenuItem>
        <DropdownMenuSeparator class="bg-gray-100 dark:bg-zinc-900 my-1" />
        <DropdownMenuItem
          class="text-red-600 dark:text-red-400 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-955/20 rounded-lg px-2.5 py-2 cursor-pointer transition-colors"
          @click="handleLogout"
        >
          <span class="text-sm font-medium">Đăng xuất</span>
          <DropdownMenuShortcut class="text-xs opacity-50">⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </SidebarFooter>
</template>

