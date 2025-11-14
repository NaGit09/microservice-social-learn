<script setup lang="ts">
import type { Post } from '@/types/post.type';
import PostHeader from '../main/PostHeader.vue';
import PostCaption from '../main/PostCaption.vue';
import File from '../Common/file/File.vue';

defineProps<{
    posts : Post[]
}>()
</script>
<template>
    <div class="flex flex-wrap justify-center items-center">
        <div class=" flex flex-col max-h-50 gap-2 m-2" v-for="item in posts" :key="String(item._id)">
            <PostHeader :author-id="item.author" />
            <File v-for="(file, idx) in item.files" :key="String(file && file.fileId ? file.fileId : idx)"
                v-bind="file" />
            <PostCaption :caption="item.caption" :user-id="item.author" />
        </div>
    </div>
</template>