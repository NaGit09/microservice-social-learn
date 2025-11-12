<script setup lang="ts">
import File from '../Common/file/File.vue'
import { usePostStore } from '@/stores/post.store'
import { storeToRefs } from 'pinia'
import { onMounted, watch } from 'vue'
import PostHeader from './PostHeader.vue'
import PostFeature from './PostFeature.vue'
import PostCaption from './PostCaption.vue'
import FastComment from '../features/FastComment.vue'

const postStore = usePostStore()
const { getRandomPost } = postStore
const { ListPost } = storeToRefs(postStore)

onMounted(() => {
  getRandomPost()
})

watch(ListPost, () => {
  console.log('newListPost - ĐÃ PHÁT HIỆN THAY ĐỔI!');
  console.log(ListPost.value);

}, { deep: true })

</script>
<template>
  <div class="absolute-center h-screen flex-1 mt-5 p-4">
    <div class="h-screen">
      <div class="post flex flex-col w-full gap-2" v-for="item in ListPost" :key="String(item._id)">
        <PostHeader :author-id="item.author" />
        <File v-for="(file, idx) in item.files.filter((f) => f) || []"
          :key="String(file && file.fileId ? file.fileId : idx)" v-bind="file" />
        <PostCaption :caption="item.caption" :user-id="item.author" />
        <PostFeature :post-id="item._id" />
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

.absolute-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
