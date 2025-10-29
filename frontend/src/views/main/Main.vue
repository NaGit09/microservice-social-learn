<script setup  lang="ts">
import Sidebar from '@/components/customs/Common/sidebar/Sidebar.vue';
import Post from '@/components/customs/main/Post.vue';
import { SidebarProvider,   } from '@/components/ui/sidebar';



</script>

<template>
    <SidebarProvider style="--sidebar-width: 15rem; --sidebar-width-mobile: 20rem;">
        <Sidebar/>
        <main>
            <Post/>
            <slot />
        </main>
    </SidebarProvider>
</template>
<style>
</style>