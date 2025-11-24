<script setup lang="ts">
import AuthFooter from '@/components/features/auth/AuthFooter.vue';
import AuthForm from '@/components/features/auth/AuthForm.vue';
import ThemeToggle from '@/components/common/theme/ThemeToggle.vue';

</script>
<template>
    <div class="flex flex-col items-center justify-evenly h-full w-full relative">
        <ThemeToggle />
        <AuthForm />
        <AuthFooter />
    </div>
</template>
<style></style>