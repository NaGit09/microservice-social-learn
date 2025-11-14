<script setup lang="ts">
import AuthFooter from '@/components/customs/Auth/AuthFooter.vue';
import AuthForm from '@/components/customs/Auth/AuthForm.vue';
import ThemeToggle from '@/components/customs/Common/theme/ThemeToggle.vue';

</script>
<template>
    <div class="flex flex-col items-center justify-evenly h-full w-full relative">
        <ThemeToggle />
        <AuthForm />
        <AuthFooter />
    </div>
</template>
<style></style>