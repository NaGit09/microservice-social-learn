<script setup lang="ts">
import File from '../Common/file/File.vue'
import { usePost } from '@/stores/post.store'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import PostHeader from './PostHeader.vue'
import PostFeature from './PostFeature.vue'
import PostCaption from './PostCaption.vue'
import CommentInput from './CommentInput.vue'

const postStore = usePost()
const { getRandomPost } = postStore
onMounted(() => {
  getRandomPost()
})
const { ListPost } = storeToRefs(postStore);


</script>
<template>
  <div class="absolute-center h-screen flex-1 mt-5 p-4">
    <div class="h-screen">
      <div class="post flex flex-col w-full gap-2" v-for="item in ListPost" :key="String(item._id)">
        <PostHeader :author-id="item.author" />
        <div class="flex flex-wrap gap-2 mt-2 ml-2">
          <File v-for="(file, idx) in item.files || []" :key="String(file && file.fileId ? file.fileId : idx)"
            v-bind="file" />
        </div>
        <PostCaption :caption="item.caption" :user-id="item.author" />
        <PostFeature />
        <CommentInput/>

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
