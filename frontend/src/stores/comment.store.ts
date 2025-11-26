import { CreateCommentApi, GetCommentRootApi } from "@/services/api/comment.api";
import type { CommentResp, CreateComment } from "@/types/comment.type";
import type { Pagination } from "@/types/common/pagination";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCommentStore = defineStore('Comment', () => {
    
    const comment = ref<CommentResp>()
    const postComment = ref<CommentResp[]>()
    const pagination = ref<Pagination>()
    const createComment = async (dto : CreateComment) : Promise<boolean> => {
        const resp = await CreateCommentApi(dto);
        if (resp) {
            comment.value = resp;
            postComment.value?.push(resp)
            return true;
        }
        return false;
    }

    const getComment = async (id : string) : Promise<boolean> => {
        const resp = await GetCommentRootApi(id);
        if (resp) {
            postComment.value = resp.comments;
            pagination.value = resp.pagination;
            return true;
        }
        return false;
    }





    return {
        comment , createComment,getComment,postComment,pagination
    }

})