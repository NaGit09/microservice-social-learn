<script setup lang="ts">
import type { ToDo } from '@/types/ToDo';
defineProps < { todo: ToDo } >()
</script>
<template>
    <p>{{ todo.content }}</p>
    <button @click="$emit('delete' , todo.id)">X</button>
</template>
<style></style>