import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message } from './entities/message.entity';

interface AuthenticatedSocket extends Socket {
  userId: string;
}

@WebSocketGateway({
  cors: { origin: '*' },
})
export class MessageGateway
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
  sendMessage(userIds: string[], message: Message) {
    this.server.to(userIds).emit('message', message);
  }
}
