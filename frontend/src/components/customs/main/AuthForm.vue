<script setup lang="ts">
import { getAssetProvier } from '@/assets/provider';
import LoginForm from './LoginForm.vue';
import RegisterForm from './RegisterForm.vue';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { router } from '@/router';

const url = getAssetProvier('social.png');
let isLogin = ref(false);

const toggle = () => {
    isLogin.value = !isLogin.value;
}
// check token exist 
const { accessToken, refreshToken , refresh } = useAuthStore(); 
if (accessToken) {
    router.push('/main')
}
if (refreshToken) {
    refresh();
    router.push('/main')
}

</script>
<template>
    <div class="flex items-center justify-evenly w-full ">
        <img :src="url" alt="banner auth" class="w-lg">
        <div v-if="isLogin">
            <LoginForm @toggle="toggle()" />
        </div>
        <div v-else>
            <RegisterForm @toggle="toggle()" />
        </div>
    </div>
</template>
<style></style>