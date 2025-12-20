<script setup lang="ts">
import { DEFAULT_BANNER } from '@/constant/default.constant';
import LoginForm from './LoginForm.vue';
import RegisterForm from './RegisterForm.vue';
import ForgotPasswordForm from './ForgotPasswordForm.vue';
import { ref } from 'vue';

type AuthMode = 'login' | 'register' | 'forgot-password';
const authMode = ref<AuthMode>('login');

const setMode = (mode: AuthMode) => {
    authMode.value = mode;
}

</script>
<template>
    <div class="flex items-center justify-evenly w-full ">
        <img :src="DEFAULT_BANNER" alt="banner auth" class="w-lg">
        <div v-if="authMode === 'login'">
            <LoginForm @toggle="setMode('register')" @forgot-password="setMode('forgot-password')" />
        </div>
        <div v-else-if="authMode === 'register'">
            <RegisterForm @toggle="setMode('login')" />
        </div>
        <div v-else-if="authMode === 'forgot-password'">
            <ForgotPasswordForm @back-to-login="setMode('login')" />
        </div>
    </div>
</template>
<style></style>