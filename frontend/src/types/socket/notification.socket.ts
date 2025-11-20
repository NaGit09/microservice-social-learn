import type { Notification } from '../notification.type';
import { BaseConnection } from './baseConnect.socket'

export class NotificationSocket extends BaseConnection {
    private notifications: Notification[];
    constructor(url: string, userId: string,notifications: Notification[]) {
        super(url,userId);
        this.notifications = notifications;
    }
    protected onConnect(): void {
        console.log('🚀 Notification System Ready');

        this.socket.on('connect', () => {
            console.log(`✅ Connected with socketId: ${this.socket.id}`);
        });

        this.socket.on('disconnect', (reason) => {
            console.log(`❌ Disconnected. Reason: ${reason}`);
        });

        this.socket.on('notification', (data : Notification) => {
            this.notifications.unshift(data);
            console.log('🔔 Received notification:', data);
        });
    }
}
