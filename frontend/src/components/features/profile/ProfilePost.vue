<script setup lang="ts">
import type { Post } from '@/types/post.type';
import PostHeader from '../../features/feed/PostHeader.vue';
import PostCaption from '../../features/feed/PostCaption.vue';
import File from '../../common/file/File.vue';

defineProps<{
    posts : Post[]
}>()
</script>
<template>
    <div class="flex flex-wrap justify-center items-center flex-col">
        <h2 class="text-white">Các bài viết đã đăng </h2>
        <div class="flex flex-wrap items-center justify-center">
            <div class=" flex  flex-col max-h-80 gap-2 m-2 border-gray-300 border-1 rounded-lg p-4"
                v-for="item in posts" :key="String(item._id)">
                <PostHeader :author-id="item.author" />
                <File v-for="(file, idx) in item.files" :key="String(file && file.fileId ? file.fileId : idx)"
                    v-bind="file" />
                <PostCaption :caption="item.caption" :user-id="item.author" />
            </div>
        </div>
    </div>
</template>