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
import { useUser } from '@/stores/user.store'
import type { Info } from '@/types/auth.type'
import { CookieUtils } from '@/utils/cookie.util'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const defaultAvatar =
    import.meta.env.DEFAULT_AVATAR ?? 'your-hardcoded-default-avatar-url.jpg'

const userStore = useUser()
const { userInfo } = storeToRefs(userStore)
const { getInfo } = userStore
const { logout } = useAuthStore();
const account = CookieUtils.getObject<Info>('account');

const handleLogout = async () => {
    const logouted = await logout();
    if (logouted) {
        router.push('/login')
        return;
    }
    console.log(logouted);
    
}

onMounted(async () => {
    try {
        await getInfo(account?.id || '')
    } catch (error) {
        console.log(error)
    }
})


</script>

<template>
    <SidebarFooter>
        <DropdownMenu>
            <DropdownMenuTrigger as-child>
                <SidebarMenuButton class="bg-black text-gray-300 border-0 text-xl mb-2" size="lg">
                    <template v-if="userInfo">
                        <Avatar class="h-8 w-8 rounded-lg">
                            <AvatarImage :src="userInfo.avatar?.url ?? defaultAvatar
                                " :alt="userInfo.username ?? ''" />
                            <AvatarFallback class="rounded-lg">
                                CN
                            </AvatarFallback>
                        </Avatar>
                        <div class="grid flex-1 text-left text-xl leading-tight">
                            <span class="truncate font-semibold">{{
                                userInfo.fullname
                                }}</span>
                        </div>
                    </template>

                    <template v-else>
                        <Avatar class="h-8 w-8 rounded-lg">
                            <AvatarFallback class="rounded-lg animate-pulse bg-gray-700" />
                        </Avatar>
                        <div class="grid flex-1 text-left text-xl leading-tight">
                            <span
                                class="truncate font-semibold animate-pulse bg-gray-700 rounded w-3/4 h-5">&nbsp;</span>
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