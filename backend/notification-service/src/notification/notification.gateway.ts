// src/chat/chat.gateway.ts
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' }, // Optional: Configure CORS for your client
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // Handle a new client connection
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  // Handle a client disconnection
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Listen for the 'message' event from a client
  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: string): void {
    console.log(`Message received from client ${client.id}: ${payload}`);
    // Broadcast the message to all connected clients
    this.server.emit('message', `[${client.id}]: ${payload}`);
  }
}
