<script setup lang="ts">
import { SidebarProvider, Sidebar } from '@/components/ui/sidebar';

</script>
<template>
    <SidebarProvider class="flex h-screen" style="--sidebar-width: 15rem; --sidebar-width-mobile: 20rem">
        <Sidebar />
    </SidebarProvider>
</template>
<script></script>
