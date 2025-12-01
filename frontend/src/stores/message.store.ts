import { defineStore } from "pinia";
import type { Message, NewMessage, NewReactMessage } from "@/types/message.type";
import type { Pagination } from "@/types/common/pagination";
import { ref } from "vue";
import { GetMessages } from "@/services/api/message.api";
import { MessageSocket } from "@/types/socket/message.socket";

export const useMessageStore = defineStore('Message', () => {
    let connection: MessageSocket;
    const messages = ref<Message[]>()
    const pagination = ref<Pagination>()
    const message = ref<Message | null>()
    const url = import.meta.env.NOTIFICATION_SOCKET_URL || 'http://localhost:8093';

    const createConnection = async (userId: string) => {
        connection = new MessageSocket(url, userId);
        connection.connection();
    }
    const getMessages = async (conversationId: string, userId: string, page = 1, size = 10) => {
        const response = await GetMessages(conversationId, userId, page, size)
        if (!messages.value || messages.value.length === 0) {
            messages.value = response.messages.reverse()
        } else {

            messages.value = [...response.messages.reverse(), ...(messages.value ?? [])]
        }
        pagination.value = response.pagination

        connection.setMessage(messages.value ?? []);
    }

    const selectMessage = (messageSelected: Message) => {
        message.value = messageSelected
    }
    const sendMessage = async (message: NewMessage) => {
        connection.sendMessage(message);
    }
    const reactMessage = async (react: NewReactMessage) => {
        connection.reactMessage(react);
    }
    return {
        messages,
        pagination,
        message,
        createConnection,
        getMessages,
        selectMessage,
        sendMessage,
        reactMessage
    }
})