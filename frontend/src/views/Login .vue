<script setup lang="ts">
import AuthFooter from '@/components/customs/main/AuthFooter.vue';
import AuthForm from '@/components/customs/main/AuthForm.vue';

</script>
<template>
    <div class="container">
        <AuthForm/>
        <AuthFooter/>
    </div>
</template>
<style>
.container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}
</style>