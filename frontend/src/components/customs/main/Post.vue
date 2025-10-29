<script setup lang="ts">
import { onMounted } from 'vue'
import File from '../Common/file/File.vue'
import { usePost } from '@/stores/post'
import { storeToRefs } from 'pinia'
import { useSidebar } from '@/components/ui/sidebar'

const postStore = usePost()

const { ListPost } = storeToRefs(postStore)
const {open , setOpen } = useSidebar();
const { getRandomPost } = postStore

onMounted(async () => {
  try {
    await getRandomPost()
  } catch (error) {
    console.log('Lỗi khi gọi getRandomPost:', error)
  }
})

const GetAuthor = async () => {
  setOpen(!open.value);
  console.log(ListPost.value)
}
</script>
<template>
  <h1>Danh sách tài liệu</h1>

  <div v-for="item in ListPost" :key="String(item._id)">
    <div
      v-for="(file, idx) in item.files || []"
      :key="String(file && file.fileId ? file.fileId : idx)"
      class=""
    >
      <File v-bind="file"></File>
    </div>
  </div>
  <button @click="GetAuthor()" class="">Get author</button>
</template>
