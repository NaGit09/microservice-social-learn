<script setup lang="ts">
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar'
import {
    LayoutDashboard,
    Users,
    FileText,
    LogOut,
    ShieldCheck,
    ChevronsUpDown,
    Sparkles,
    BadgeCheck,
    CreditCard,
    Bell,
    Link,
} from 'lucide-vue-next'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUserStore } from '@/stores/user.store'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { CookieUtils } from '@/utils/cookie.util'
import { router } from '@/router'
import { onMounted } from 'vue'

const route = useRoute()
const userStore = useUserStore()
const { ownerInfo } = storeToRefs(userStore)

const handleLogout = () => {
    CookieUtils.remove('accessToken')
    CookieUtils.remove('user')
    window.location.href = '/login'
}
const { open } = useSidebar()

onMounted(() => {
    open.value = true
})

const menuItems = [
    {
        title: 'Dashboard',
        url: '/admin/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Users',
        url: '/admin/users',
        icon: Users,
    },
    {
        title: 'Posts',
        url: '/admin/posts',
        icon: FileText,
    },
]
const handleGoToWebsite = () => {
    router.push('/')
}
</script>

<template>
    <Sidebar v-model="open"
        class="border-r border-white/20 bg-white/40 dark:bg-black/40 backdrop-blur-xl supports-[backdrop-filter]:bg-white/40">
        <SidebarHeader>
            <div class="flex items-center gap-3 px-4 py-6">
                <div class="p-2.5 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-xl shadow-lg shadow-blue-500/20">
                    <ShieldCheck class="w-6 h-6 text-white" />
                </div>
                <div class="flex flex-col">
                    <span class="text-lg font-bold tracking-tight">Admin Panel</span>
                    <span class="text-xs text-muted-foreground">Pro Management</span>
                </div>
            </div>
        </SidebarHeader>

        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel
                    class="uppercase tracking-wider font-semibold text-xs text-muted-foreground/70 px-4 mb-2">Menu
                </SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu class="px-2 space-y-1 list-none">
                        <SidebarMenuItem v-for="item in menuItems" :key="item.title">
                            <SidebarMenuButton as-child :isActive="route.path.startsWith(item.url)"
                                class="w-full transition-all duration-200 ease-in-out hover:translate-x-1" :class="{
                                    'bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 shadow-sm':
                                        route.path.startsWith(item.url),
                                    'hover:bg-gray-100/50 dark:hover:bg-white/5':
                                        !route.path.startsWith(item.url),
                                }">
                                <router-link :to="item.url"
                                    class="flex items-center gap-3 p-2 rounded-lg  no-underline dark:text-white text-black">
                                    <component :is="item.icon" class="w-5 h-5" :class="route.path.startsWith(item.url)
                                        ? 'stroke-[2.5px]'
                                        : 'stroke-2'
                                        " />
                                    <span class="font-medium">{{ item.title }}</span>
                                </router-link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>

        <SidebarFooter class="p-0">
            <SidebarMenu class="list-none p-0">
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                            <SidebarMenuButton size="lg"
                                class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground transition-all duration-200 hover:bg-white/50 dark:hover:bg-white/10">
                                <Avatar class="h-8 w-8 rounded-lg border border-white/20">
                                    <AvatarImage :src="ownerInfo?.avatar?.url || ''" :alt="ownerInfo?.username" />
                                    <AvatarFallback
                                        class="rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 font-bold">
                                        {{ ownerInfo?.username?.charAt(0)?.toUpperCase() || 'A' }}
                                    </AvatarFallback>
                                </Avatar>
                                <div class="grid flex-1 text-left text-sm leading-tight">
                                    <span class="truncate font-semibold">{{ ownerInfo?.username || 'Admin' }}</span>
                                    <span class="truncate text-xs text-muted-foreground">{{ ownerInfo?.fullname ||
                                        'Administrator' }}</span>
                                </div>
                                <ChevronsUpDown class="ml-auto size-4" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-white/80 dark:bg-black/80 backdrop-blur-xl border-white/20 shadow-xl"
                            side="bottom" align="end" :side-offset="4">
                            <DropdownMenuLabel class="p-0 font-normal">
                                <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <Avatar class="h-8 w-8 rounded-lg">
                                        <AvatarImage :src="ownerInfo?.avatar?.url || ''" :alt="ownerInfo?.username" />
                                        <AvatarFallback class="rounded-lg">
                                            {{ ownerInfo?.username?.charAt(0)?.toUpperCase() || 'A' }}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div class="grid flex-1 text-left text-sm leading-tight">
                                        <span class="truncate font-semibold">{{ ownerInfo?.username || 'Admin' }}</span>
                                        <span class="truncate text-xs">{{ ownerInfo?.fullname || 'Administrator'
                                        }}</span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem class="cursor-pointer">
                                    <Sparkles class="mr-2 h-4 w-4 text-amber-500" />
                                    <span>Upgrade to Pro</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem class="cursor-pointer">
                                    <BadgeCheck class="mr-2 h-4 w-4" />
                                    <span>Account</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem class="cursor-pointer">
                                    <CreditCard class="mr-2 h-4 w-4" />
                                    <span>Billing</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem class="cursor-pointer" @click="handleGoToWebsite">
                                    <Link class="mr-2 h-4 w-4" />
                                    <span>Go to website</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem @click="handleLogout"
                                class="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950/30">
                                <LogOut class="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
</template>
