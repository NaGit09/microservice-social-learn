import {   getUserInfo } from "@/services/user/user.api";
import type { UserInfo } from "@/types/user/user";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUser = defineStore('User', () => {
    const userInfo = ref<UserInfo>()

    const getInfo = async (userId : string) => {
        const info = await getUserInfo(userId);
        userInfo.value = info;
    }
    return {
        userInfo,
        getInfo
    }
})