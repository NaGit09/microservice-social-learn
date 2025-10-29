<script setup lang="ts">
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from '@/components/ui/dropdown-menu'
import { SidebarFooter, SidebarMenuButton } from '@/components/ui/sidebar'
import { useUser } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const defaultAvatar =
    import.meta.env.DEFAULT_AVATAR ?? 'your-hardcoded-default-avatar-url.jpg'

const userStore = useUser()
const { userInfo } = storeToRefs(userStore)
const { getInfo } = userStore

onMounted(async () => {
    try {
        await getInfo('68f493debb30934b03bf4b37')
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

            <DropdownMenuContent class="w-[--reka-dropdown-menu-trigger-width] min-w-90 h-100 rounded-lg" align="start"
                side="top" :side-offset="4">
                <div class="p-2">Nội dung menu</div>
            </DropdownMenuContent>
        </DropdownMenu>
    </SidebarFooter>
</template>