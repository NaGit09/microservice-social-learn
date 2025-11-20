import { getNotifications } from "@/services/api/notification.api";
import type { Pagination } from "@/types/common/pagination";
import type { Notification } from "@/types/notification.type";
import { NotificationSocket } from "@/types/socket/notification.socket";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useNotificatonStore = defineStore('Notification', () => {
    let connection;
    
    const url = import.meta.env.NOTIFICATION_SOCKET_URL || 'http://localhost:8084';
    const notifications = ref<Notification[]>();
    const pagination = ref<Pagination>();
    
    async function CreateConnection(userId: string) {
        connection = new NotificationSocket(url, userId, notifications.value ?? []);
        connection.connection();
    }

    async function GetNotify(userId : string) {
        try {
            const notifies = await getNotifications(userId);
            if (!notifies) console.log("not notification");
            notifications.value = notifies.data;
            pagination.value = notifies.pagination;
        } catch (error) {
            console.log(error);
            
        }
    }

    return {
        notifications,
        CreateConnection,
        GetNotify
    }
})