<script setup lang="ts">
import { Notivue, Notification } from 'notivue'

</script>
<template>
  <div class="w-full h-screen   flex items-center justify-center bg-black text-gray-300">
    <router-view />
    <Notivue v-slot="item">
      <Notification :item="item" />
    </Notivue>
  </div>
</template>

<style></style>
