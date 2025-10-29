 <script setup lang="ts">
import {
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Search } from 'lucide-vue-next';
defineProps<{open : boolean}>()
</script>
 <template>
    <!-- Sidebar header logo -->
    <SidebarHeader>
        <SidebarMenu class="p-0">
            <SidebarMenuItem>
                <SidebarMenuButton class="bg-black hover:bg-black hover:text-gray-100 text-gray-300 border-0" size="lg">
                    <div v-if="!open" class="flex aspect-square size-8 items-center justify-center rounded-lg">
                        <component :is="Search" class="size-6" />
                    </div>
                    <div v-else class="grid flex-1 text-left text-3xl italic leading-tight">
                        <span class="truncate font-semibold"> Social learn </span>
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    </SidebarHeader>
</template>