<script setup lang="ts">
import { toast, Toaster } from 'vue-sonner';
import 'vue-sonner/style.css';
import { getNotifications } from './services/api/notification.api';
import { onMounted } from 'vue';

onMounted( async () => {
  const data = await getNotifications("68e4ae30269074dd5435c561", 1, 10);
  data.data.forEach((n) => console.log(n))
  
  toast('Fetch data', {
    description: ' Fetch data successfully',

  })
})

</script>
<template>
  <div class="w-full h-screen   flex items-center justify-center bg-black text-gray-300">
    <router-view />
    <Toaster class="z-10"/>


  </div>
</template>

<style></style>
