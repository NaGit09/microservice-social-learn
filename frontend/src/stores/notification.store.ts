import { getNotifications } from "@/services/api/notification.api";
import type { NotificationPagination } from "@/types/notification.type";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useNotificatonStore = defineStore('Notification', () => {
    const notifications = ref<NotificationPagination>();
    async function GetNotify(userId : string) {
        try {
            const notifies = await getNotifications(userId);
            if (!notifies) console.log("not notification");
            notifications.value = notifies;
            
        } catch (error) {
            console.log(error);
            
        }
    }
    return {
        notifications,
        GetNotify
    }
})