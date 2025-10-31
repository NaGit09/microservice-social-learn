<script setup lang="ts">
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useUser } from '@/stores/user.store';
import { storeToRefs } from 'pinia';
import { onMounted  } from 'vue';
import UserRecommend from './UserRecommend.vue';
import { CookieUtils } from '@/utils/cookie.util';
import type { Info } from '@/types/auth.type';
const userStore = useUser();
const { userInfo, userRecommend } = storeToRefs(userStore);
const { recommend } = userStore;
const userId = CookieUtils.getObject<Info>('account');

onMounted(() => {
   try {

       recommend(userId?.id || '');
   } catch (error) {
    console.log(error);
    
   }
})
 

</script>
<template>
    <!-- user info  -->
    <div class="container flex items-center justify-between">
        <div class="flex items-center gap-4">
            <Avatar class="h-12 w-12 rounded-full">
                <AvatarImage :src="userInfo?.avatar?.url ?? ''" :alt="userInfo?.username ?? ''" />
                <AvatarFallback class="rounded-lg">
                    CN
                </AvatarFallback>
            </Avatar>
            <div class="user-infor flex  flex-col">
                <span class="text-xl text-boid">{{ userInfo?.username }}</span>
                <span class="text-gray-400">{{ userInfo?.fullname }}</span>
            </div>
        </div>
        <RouterLink class="no-underline text-blue-600" to="/login">Transfer</RouterLink>
    </div>
    <!-- User recomment ! -->
    <div class="flex items-center justify-between">
        <span>Suggestions for you</span>
        <RouterLink to="/suggestions">View all</RouterLink>
    </div>
    <div class="recommend users">
        <ul class="list-none recomment">
            <li v-for="user in userRecommend">
                <UserRecommend v-bind="user" />
            </li>
        </ul>
    </div>

</template>