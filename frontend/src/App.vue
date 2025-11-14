<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
import ThemeToggle from './components/customs/Common/theme/ThemeToggle.vue';
</script>
<template>
  <div
    class="w-full h-screen flex items-center justify-center"
  >
    <router-view />
    <Toaster class="z-10" />
  </div>
</template>

<style></style>
