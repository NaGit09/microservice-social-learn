<script setup lang="ts">
import PostHeader from './PostHeader.vue'
import PostFeature from './PostFeature.vue'
import PostCaption from './PostCaption.vue'
import FastComment from '../features/FastComment.vue'
import PostMedia from './PostMedia.vue'
import type { Post } from '@/types/post.type'

defineProps<{
  ListPost: Post[]
}>()
</script>

<template>
  <div class="flex items-center justify-center h-screen flex-1 mt-5 p-4">
    <div class="h-screen">
      <div
        class="flex flex-col post gap-2"
        v-for="item in ListPost"
        :key="String(item._id)"
      >
        <PostHeader :author-id="item.author" />

        <PostMedia :files="item.files || []" />

        <PostCaption :caption="item.caption" :user-id="item.author" />
        <PostFeature
          :post-id="item._id"
          :total-comment="item.totalComment"
          :total-like="item.totalLike"
          :is-liked-by-current-user="false"
        />
        <FastComment />
      </div>
    </div>
  </div>
</template>

<style>
.post {
  width: 500px;
  margin: 20px auto;
}
</style>
