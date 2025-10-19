import { Injectable } from "@nestjs/common";

@Injectable()
export class OnlineUsersService {
    private userSocketMap = new Map<string, string>();

    addUser(userId: string, socketId: string) {
        this.userSocketMap.set(userId, socketId);
    }

    removeUser(userId: string) {
        this.userSocketMap.delete(userId);
    }

    getSocketId(userId: string): string | undefined {
        return this.userSocketMap.get(userId);
    }
}