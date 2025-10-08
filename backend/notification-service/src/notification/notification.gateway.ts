import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface AuthenticatedSocket extends Socket {
  userId: string;
}

@WebSocketGateway({
  cors: { origin: '*' },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  // handle user connection request !
  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;

    if (!userId) {
      client.disconnect();
      return;
    }

    await client.join(userId);
  }
  // handle user disconnect !
  handleDisconnect(client: Socket) {
    console.log(
      `🔌 Client disconnected: socketId=${client.id}, userId=${(client as AuthenticatedSocket).userId}`,
    );
  }
  // push notification into user
  sendNotification(userId: string, payload: any) {
    this.server.to(userId).emit('notification', payload);
  }
}
