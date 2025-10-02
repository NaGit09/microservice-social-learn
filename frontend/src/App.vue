<script setup lang="ts">
import BlogApp from './components/BlogApp.vue';
const post = {
    name : 'the end of the world',
    public : 2004,
    author : 'saber'
}
</script>

<template>
<BlogApp :bookProp="post"/>
</template>
<style scoped>

</style>
