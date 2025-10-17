import { Socket, Server } from 'socket.io';
import { OnlineUsersService } from 'src/services/online-users.service';
import z from 'zod';
export function  broadcastToConversation(
    server: Server,
    onlineUser : OnlineUsersService,
    participantUserIds: string[],
    event: string,
    payload: any,
  ) {
    const participantSocketIds = participantUserIds
      .map((userId) => onlineUser.getSocketId(userId))
      .filter((socketId): socketId is string => !!socketId);

    if (participantSocketIds.length > 0) {
      server.to(participantSocketIds).emit(event, payload);
    }
  }

  export function  emitError(client: Socket, failedEvent: string, error: any) {
    let details = 'Internal server error';
    if (error instanceof z.ZodError) {
      details = error.name;
    } else if (error.message) {
      details = error.message;
    }

    client.emit('ws_error', {
      event: failedEvent,
      message: `Your '${failedEvent}' request failed.`,
      details,
    });
  }