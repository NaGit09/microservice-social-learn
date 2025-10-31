<script setup  lang="ts">
import Sidebar from '@/components/customs/Common/sidebar/Sidebar.vue';
import Post from '@/components/customs/main/Post.vue';
import Recomment from '@/components/customs/User/Recomment.vue';
import { SidebarProvider,   } from '@/components/ui/sidebar';
 
</script>

<template>
    <SidebarProvider class="flex" style="--sidebar-width: 15rem; --sidebar-width-mobile: 20rem;">
        <Sidebar />
        <main class="flex-1 flex items-center justify-between h-full mt-5 mx-8">
            <Post />
            <Recomment />

        </main>
    </SidebarProvider>
</template>
<style>
</style>