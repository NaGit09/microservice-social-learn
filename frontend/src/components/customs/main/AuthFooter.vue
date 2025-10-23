<script setup lang="ts">
const listFooter = [
    "Meta",
    "Giới thiệu",
    "Blog",
    "Việc làm",
    "Trợ giúp",
    "API",
    "Quyền riêng tư",
    "Điều khoản",
    "Vị trí",
    "Instagram Lite",
    "Meta AI",
    "Bài viết do Meta AI tạo",
    "Threads",
    "Tải thông tin người liên hệ lên & người không phải người dùng",
    "Meta đã xác minh",
    "Tiếng Việt",
    "© 2025 Instagram from Meta"
];

</script>
<template>
    <div class="footer">
        <ul class="footer flex-wrap">
            <li v-for=" footer in listFooter">
                <a href="" class="text-nowrap text-gray-400 no-underline">{{footer}}</a>
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