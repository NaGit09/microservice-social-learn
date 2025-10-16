import { Inject } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { type CreateMessageDto, CreateMessageDtoSchema } from 'src/common/dto/messages/create-message';
import { ConversationService } from 'src/conversation/conversation.service';
import { MessageService } from 'src/messages/message.service';
import { OnlineUsersService } from 'src/services/online-users.service';
import z from 'zod';

interface AuthenticatedSocket extends Socket {
  userId: string;
}

@WebSocketGateway({
  cors: { origin: '*' },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  constructor(@Inject() private readonly message: MessageService,
    private readonly conversation: ConversationService,
    private readonly onlineUser: OnlineUsersService,
  ) { }
  // handle user connection request !
  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    console.log(userId);

    if (!userId) {
      client.disconnect();
      return;
    }
    this.onlineUser.addUser(userId,client.id);
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
  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() data: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // 1. Validation (đã làm tốt)
      const messageDto = CreateMessageDtoSchema.parse(data);

      // 2. Lưu tin nhắn vào DB
      const savedMessage = await this.message.create(messageDto);
      console.log('📨 New message saved:', savedMessage.content);

      const participantUserIds = await this.conversation.getUsers(savedMessage.convId.toString());

      const participantSocketIds = participantUserIds
        .map(userId => this.onlineUser.getSocketId(userId))
        .filter(socketId => socketId !== undefined);

      if (participantSocketIds.length > 0) {
        this.server.to(participantSocketIds).emit('receive_message', savedMessage);
      }

      client.emit('send_message_success', savedMessage);

    } catch (error) {
      console.error('Error sending message:', error);

      client.emit('send_message_failed', {
        message: 'Tin nhắn của bạn không thể gửi đi được.',
        details: error instanceof z.ZodError ? error.message : 'Internal server error'
      });
    }
  }
}
