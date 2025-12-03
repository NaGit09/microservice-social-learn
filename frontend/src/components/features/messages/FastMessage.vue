<script setup lang="ts">
defineProps({
    UserInfo: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <div>
        <div>
            <img :src="UserInfo.avatar" alt="">
            <p>{{ UserInfo.name }}</p>
        </div>
    </div>
</template>