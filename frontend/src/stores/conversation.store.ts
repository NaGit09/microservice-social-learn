import { GetConversationsApi } from "@/services/api/conversation.api";
import type { Pagination } from "@/types/common/pagination";
import type { Conversation } from "@/types/conversation.type";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useConversationStore = defineStore('Conversation', () => {
    const conversations = ref<Conversation[]>()
    const pagination = ref<Pagination>()
    const conversation = ref<Conversation>()

    const getConversations = async (userId : string) => {
        const response = await GetConversationsApi(userId)
        conversations.value = response.conversations
        pagination.value = response.pagination
    }

    const selectConversation = (conversationSelected : Conversation) => {
        conversation.value = conversationSelected
    }

    return {
        conversations,
        pagination,
        conversation,
        getConversations,
        selectConversation
    }
})