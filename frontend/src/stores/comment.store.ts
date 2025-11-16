import { CreateCommentApi } from "@/services/api/comment.api";
import type { CommentResp, CreateComment } from "@/types/comment.type";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCommentStore = defineStore('Comment', () => {
    const comment = ref<CommentResp>()
    const createComment = async (dto : CreateComment) : Promise<boolean> => {
        const resp = await CreateCommentApi(dto);
        if (resp) {
            comment.value = resp;
            return true;
        }
        return false;
    }
    return {
        comment , createComment
    }
})