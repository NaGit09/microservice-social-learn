<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import Input from '@/components/ui/input/Input.vue';
import { useAuthStore } from '@/stores/auth';
import type { loginReq } from '@/types/auth/auth';
import { Facebook } from 'lucide-vue-next';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
const email = ref("");
const password = ref("");
const { user, accessToken, refreshToken, login, refresh } = useAuthStore();
const hanldeSubmit = async () => {
    if (!accessToken && !refreshToken) {
        const loginObj: loginReq = { email: email.value, password: password.value }
        await login(loginObj);
        console.log(accessToken);
    }
    if (!accessToken) {
        await refresh();
    }
    console.log("Login successfully !");
}
</script>
<template>
    <div class="container top-layout flex-col p-4 w-90 gap-4">
        <h1 class="title mb-4">Social learn</h1>
        <div class="container">
            <form @submit.prevent="hanldeSubmit">
                <Input class="w-70 mb-3" v-model="email" type="email" placeholder="Enter your email !" />
                <Input class="mb-4 w-70" v-model="password" type="password" placeholder="Enter your password !" />
                <Button class="w-70 login-btn">Login</Button>
            </form>
        </div>
        <div class="flex items-center w-70">
            <hr class="line">
            <span class="px-3">Or</span>
            <hr class="line">
        </div>
        <a href="https://www.facebook.com/" class="auth2 flex items-center">
            <Facebook />
            <span class="m-2">Login with Facebook</span>
        </a>
        <span class="mb-4">Forgot password ?</span>
    </div>
    <!-- <RouterLink to="/register" class="top-layout m-4 p-4 w-90 container">
        <p>You can't account ? <span class="text-blue-600">Register</span></p>
    </RouterLink> -->
</template>
<style>
.top-layout {
    border: 1px solid rgb(245, 245, 245);
}

.container {
    display: flex;
    align-items: center;
    justify-content: center;
}

.title {
    font-size: 50px;
}

.login-btn {
    background-color: rgb(74, 93, 249);
}

.line {
    width: 70%;

}

.auth2 {
    color: #0094fe;
    font-size: 20px;
}
</style>