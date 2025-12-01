import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnlineUsersService } from './onlineUser.service';
import { Logger } from '@nestjs/common';
import { AuthenticatedSocket } from './types/auth-socket.type';

 

@WebSocketGateway({
  cors: { origin: '*' },
})
  
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(NotificationGateway.name);

  constructor(private readonly onlineUser: OnlineUsersService) { }

  async handleConnection(client: AuthenticatedSocket) {
    const userId = client.handshake.query.userId as string;
    if (!userId) {
      this.logger.warn(`Connection rejected: No userId provided`);
      client.disconnect();
      return;
    }

    // 1. Gán userId vào socket object để dùng lúc disconnect
    client.userId = userId;

    this.logger.log(`User connected: ${userId} (Socket: ${client.id})`);

    // 2. Lưu vào OnlineUsersService (để track online/offline nếu cần)
    this.onlineUser.addUser(userId, client.id);

    // 3. QUAN TRỌNG: Join vào room tên là userId
    await client.join(userId);
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      this.logger.log(`Client disconnected: ${client.userId}`);
      this.onlineUser.removeUser(client.userId);
    }
  }

  sendNotification(userId: string, payload: any) {
    if (!userId || !payload) {
      return;
    }

    this.server.to(userId).emit('notification', payload);

    this.logger.log(`Sent notification to room ${userId}`);
  }
}