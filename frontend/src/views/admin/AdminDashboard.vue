<script setup lang="ts">
import AdminSidebar from '@/components/admin/AdminSidebar.vue';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
</script>

<template>
    <div class="h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <SidebarProvider class="bg-transparent">
            <AdminSidebar />
            <SidebarInset class="bg-transparent">
                <main class="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <router-view></router-view>
                </main>
            </SidebarInset>
        </SidebarProvider>
    </div>

</template>