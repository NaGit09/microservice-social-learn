<script setup lang="ts">
const listFooter = [
  'Meta',
  'Giới thiệu',
  'Blog',
  'Việc làm',
  'Trợ giúp',
  'API',
  'Quyền riêng tư',
  'Điều khoản',
  'Vị trí',
  'Instagram Lite',
  'Meta AI',
  'Bài viết do Meta AI tạo',
  'Threads',
  'Tải thông tin người liên hệ lên & người không phải người dùng',
  'Meta đã xác minh',
  'Tiếng Việt',
  '© 2025 Instagram from Meta',
]
</script>
<template>
  <div class="w-[90%]">
    <ul class="flex flex-wrap list-none gap-3 items-center justify-center">
      <li v-for="footer in listFooter">
        <a
          href=""
          class="text-sm text-wrap no-underline text-gray-700 dark:text-gray-400 hover:underline"
          >{{ footer }}</a
        >
      </li>
    </ul>
  </div>
</template>
<style></style>
