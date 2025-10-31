<script setup lang="ts">
import File from '../Common/file/File.vue'
import { usePost } from '@/stores/post.store'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const postStore = usePost()
const { getRandomPost } = postStore;
onMounted(() => {
  getRandomPost();
})
const { ListPost } = storeToRefs(postStore)
 
</script>
<template>
  <div class="">
    <h1>Danh sách tài liệu</h1>

    <div v-for="item in ListPost" :key="String(item._id)">
      <div v-for="(file, idx) in item.files || []" :key="String(file && file.fileId ? file.fileId : idx)" class="">
        <File v-bind="file"></File>
      </div>
    </div>

  </div>
</template>
