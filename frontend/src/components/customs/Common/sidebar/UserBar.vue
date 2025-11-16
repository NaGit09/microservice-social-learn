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
import { ref } from 'vue'

const { logout } = useAuthStore()
const defaultAvatar = import.meta.env.DEFAULT_AVATAR ?? ''

const useUser = useUserStore()
const { ownerInfo } = storeToRefs(useUser)
const isDark = ref(true)
const mode = useColorMode()
const handleSwitch = () => {
  isDark.value = !isDark.value
  mode.value = isDark.value ? 'light' : 'dark'
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
  <SidebarFooter>
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <SidebarMenuButton class="border-0 text-xl mb-2" size="lg">
          <template v-if="ownerInfo">
            <Avatar class="h-8 w-8 rounded-lg">
              <AvatarImage
                class="object-cover"
                :src="ownerInfo.avatar?.url ?? defaultAvatar"
                :alt="ownerInfo.username ?? ''"
              />
              <AvatarFallback class="rounded-lg"> CN </AvatarFallback>
            </Avatar>
            <div class="grid flex-1 text-left text-xl leading-tight">
              <span class="truncate font-thin dark:text-gray-200">{{
                ownerInfo.fullname
              }}</span>
            </div>
          </template>

          <template v-else>
            <Avatar class="h-8 w-8 rounded-lg">
              <AvatarFallback class="rounded-lg animate-pulse" />
            </Avatar>
            <div class="grid flex-1 text-left text-xl leading-tight">
              <span
                class="truncate font-semibold animate-pulse rounded w-3/4 h-5"
                >&nbsp;</span
              >
            </div>
          </template>
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent class="w-56 bg-gray-50 dark:bg-black">
        <DropdownMenuLabel class="dark:text-gray-200"
          >My Account</DropdownMenuLabel
        >
        <DropdownMenuSeparator class="dark:text-gray-200" />
        <DropdownMenuItem class="dark:text-gray-200">
          <span @click="handleLogout">Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          class="flex items-center justify-between dark:text-gray-200"
        >
          <span @click="handleLogout">Chế độ</span>
          <Switch
            :model-value="isDark"
            @update:model-value="handleSwitch"
            class="border-gray-500 border-1 w-10 flex items-center"
          >
            <template #thumb>
              <Sun
                v-if="isDark"
                icon="lucide:moon"
                class="dark:text-gray-200"
              />
              <Moon v-else icon="lucide:sun" class="dark:text-gray-200" />
            </template>
          </Switch>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </SidebarFooter>
</template>
