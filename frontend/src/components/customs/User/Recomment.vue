<script setup lang="ts">
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useUser } from '@/stores/user.store';
import { storeToRefs } from 'pinia';
import { onMounted  } from 'vue';
import UserRecommend from './UserRecommend.vue';
import { CookieUtils } from '@/utils/cookie.util';
import type { Info } from '@/types/auth.type';
import RecommentFooter from './RecommentFooter.vue';
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
    <div class="flex gap-3 flex-col">
        <!-- user info  -->
        <div class="container flex items-center justify-between gap-3 mb-3">
            <div class="flex items-center gap-4">
                <Avatar class="h-10 w-10 rounded-full">
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
            <RouterLink class="no-underline text-blue-400 font-bold text-sm" to="/login">Transfer</RouterLink>
        </div>
        <!-- User recomment ! -->
        <div class="flex items-center justify-between">
            <span class="text-gray-500 font-bold">Suggestions for you</span>
            <RouterLink class="no-underline text-gray-300 font-bold" to="/suggestions">View all</RouterLink>
        </div>
        <div class="w-full">
            <ul class="list-none  flex items-start flex-col px-0">
                <li class="w-full m-1" v-for="user in userRecommend">
                    <UserRecommend v-bind="user" />
                </li>
            </ul>
        </div>
        <RecommentFooter/>
    </div>
</template>