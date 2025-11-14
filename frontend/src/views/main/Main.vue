<script setup  lang="ts">
import Sidebar from '@/components/customs/Common/sidebar/Sidebar.vue';
import PostDispay from '@/components/customs/main/PostDispay.vue';
import Recomment from '@/components/customs/User/Recomment.vue';
import { SidebarProvider,   } from '@/components/ui/sidebar';
import { usePostStore } from '@/stores/post.store';
import { storeToRefs } from 'pinia';
import { onMounted, watch } from 'vue';

const postStore = usePostStore()
const { getRandomPost } = postStore
const { ListPost } = storeToRefs(postStore)

onMounted(() => {
    getRandomPost()
})

watch(
    ListPost,
    () => {
        console.log(ListPost.value.length);
        
    },
    { deep: true }
)
</script>

<template>
    <SidebarProvider class="flex" style="--sidebar-width: 15rem; --sidebar-width-mobile: 20rem;">
        <Sidebar />
        <main class="flex-1  h-full mt-5 mx-8">
            <div class="flex items-start justify-between  overflow-auto">
                <PostDispay :ListPost="ListPost" />
                <Recomment />
            </div>
        </main>
    </SidebarProvider>
</template>

<style>
 
</style>