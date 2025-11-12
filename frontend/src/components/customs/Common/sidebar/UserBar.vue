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
import { router } from '@/router'
import { useAuthStore } from '@/stores/auth.store'
import type { UserInfo } from '@/types/user.type'
import { CookieUtils } from '@/utils/cookie.util'

const defaultAvatar = import.meta.env.DEFAULT_AVATAR ?? ''

const ownerInfo = CookieUtils.getObject<UserInfo>('ownerInfo')

const { logout } = useAuthStore()

const handleLogout = async () => {
  const logouted = await logout()
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
        <SidebarMenuButton
          class="bg-black text-gray-300 border-0 text-xl mb-2"
          size="lg"
        >
          <template v-if="ownerInfo">
            <Avatar class="h-8 w-8 rounded-lg">
              <AvatarImage
                :src="ownerInfo.avatar?.url ?? defaultAvatar"
                :alt="ownerInfo.username ?? ''"
              />
              <AvatarFallback class="rounded-lg"> CN </AvatarFallback>
            </Avatar>
            <div class="grid flex-1 text-left text-xl leading-tight">
              <span class="truncate font-semibold">{{
                ownerInfo.fullname
              }}</span>
            </div>
          </template>

          <template v-else>
            <Avatar class="h-8 w-8 rounded-lg">
              <AvatarFallback class="rounded-lg animate-pulse bg-gray-700" />
            </Avatar>
            <div class="grid flex-1 text-left text-xl leading-tight">
              <span
                class="truncate font-semibold animate-pulse bg-gray-700 rounded w-3/4 h-5"
                >&nbsp;</span
              >
            </div>
          </template>
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent class="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <span @click="handleLogout">Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </SidebarFooter>
</template>
