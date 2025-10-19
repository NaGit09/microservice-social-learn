import { HttpException, HttpStatus, Inject, Logger } from '@nestjs/common';
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
import { type ReactMessageDto, ReactMessageDtoSchema } from 'src/common/dto/messages/react-message';
import { ConversationService } from 'src/conversation/conversation.service';
import { MessageService } from 'src/messages/message.service';
import { OnlineUsersService } from 'src/kafka/online-users.service';
import { broadcastToConversation, emitError } from 'src/utils/helper.util';
import { AuthenticatedSocket } from 'src/common/types/auth-socket';


@WebSocketGateway({
  cors: { origin: '*' },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(SocketGateway)
  constructor(@Inject() private readonly message: MessageService,
    @Inject() private readonly conversation: ConversationService,
    private readonly onlineUser: OnlineUsersService,
  ) { }
  // handle user connection request !
  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (!userId) {
      client.disconnect();
      return;
    }
    this.onlineUser.addUser(userId, client.id);
    await client.join(userId);
  }
  // handle user disconnect !
  handleDisconnect(client: Socket) {
    console.log(
      `🔌 Client disconnected: socketId=${client.id}, 
      userId=${(client as AuthenticatedSocket).userId}`,
    );
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() data: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const messageDto = CreateMessageDtoSchema.parse(data);

      const savedMessage = await this.message.create(messageDto);

      const participants = await this.conversation
        .getUsers(messageDto.senderId, savedMessage.convId._id.toString())

      broadcastToConversation(
        this.server,
        this.onlineUser,
        participants,
        'receive_message',
        savedMessage,
      );

      client.emit('send_message_success', savedMessage);

    } catch (error) {
      console.error(`Error sending message: ${error.message}`, error.stack);
      emitError(client, 'send_message', error);
    }
  }

  @SubscribeMessage('react_message')
  async handleReactMessage(
    @MessageBody() data: ReactMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const reactDto = ReactMessageDtoSchema.parse(data);

      const savedMessage = await this.message.react(reactDto);
      if (!savedMessage) {
        throw new HttpException('React message failed !', HttpStatus.BAD_REQUEST);
      }
      const participants = await this.conversation.getUsers(
        reactDto.react.userId, reactDto.messageId
      );

      broadcastToConversation(
        this.server,
        this.onlineUser,
        participants,
        'message_reacted',
        savedMessage,
      );

      client.emit('react_message_success', savedMessage);

    } catch (error) {
      console.error(`Error reacting to message: ${error.message}`, error.stack);
      emitError(client, 'react_message', error);
    }
  }
}
