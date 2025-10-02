<script setup lang="ts">
import type { Book } from '@/types/Book';

defineProps<{
    bookProp: Book
}>()
</script>

<template>
    <div class="book">
        <h3 class="book-name">{{ bookProp.name }}</h3>
        <p class="book-year">public year : {{ bookProp.public }}</p>
        <p class="book-author">Create by {{ bookProp.author }}</p>
    </div>
</template>

<style>
.book-name {
    font-size: 20px;
    font-weight: bold;
    color: red;
}

.book-year {
    font-style: italic;
}

.book-author {
    text-decoration: underline;
}
</style>