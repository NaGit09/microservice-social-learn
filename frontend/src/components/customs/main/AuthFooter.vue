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
                <a href="" class="text-nowrap">{{footer}}</a>
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
    color: #A8A8A8;
    font-size: 12px;
    text-align: center;
}
</style>