import { LikeApi, UnlikeApi } from "@/services/api/like.api";
import type { LikeReq } from "@/types/like.type";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useLikeStore = defineStore('Like', () => {
    const isLiked = ref(false);

    async function Like(dto : LikeReq) {
        const likeResp = await LikeApi(dto);
        console.log(likeResp);
        isLiked.value = likeResp;
    }

    async function Unlike(dto: LikeReq) {
        const likeResp = await UnlikeApi(dto);
        console.log(likeResp);
        isLiked.value = likeResp;
    }
 
    return {
        isLiked,
        Like,
        Unlike,
    }
})