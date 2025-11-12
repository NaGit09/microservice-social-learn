<script setup lang="ts">
const listFooters = [
  'Introduce',
  'Help',
  'Press',
  'API',
  'Job',
  'Privacy',
  'Clause',
  'Location',
  'Language',
  'Meta',
  'Verified',
  '© 2025 Instagram from Meta',
]
</script>
<template>
  <div class="w-80">
    <ul class="list-none flex-wrap flex items-center gap-3 px-0">
      <li v-for="footer in listFooters">
        <a href="" class="text-nowrap text-sm text-gray-600 no-underline">{{
          footer
        }}</a>
      </li>
    </ul>
  </div>
</template>
<style>
.footer {
  margin-top: 40px;
  width: 90vw;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  font-size: 12px;
  text-align: center;
  list-style: none;
}
</style>
