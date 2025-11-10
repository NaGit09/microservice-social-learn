<script setup  lang="ts">
import Sidebar from '@/components/customs/Common/sidebar/Sidebar.vue';
import Post from '@/components/customs/main/Post.vue';
import Recomment from '@/components/customs/User/Recomment.vue';
import { SidebarProvider,   } from '@/components/ui/sidebar';
 
</script>

<template>
    <SidebarProvider class="flex" style="--sidebar-width: 15rem; --sidebar-width-mobile: 20rem;">
        <Sidebar />
        <main class="flex-1  h-full mt-5 mx-8">
            <div class="flex items-start justify-between  overflow-auto">
                <Post />
                <Recomment />
            </div>
        </main>
    </SidebarProvider>
</template>

<style>
 
</style>