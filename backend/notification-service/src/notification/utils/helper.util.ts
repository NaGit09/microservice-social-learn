import { Socket, Server } from 'socket.io';
import z from 'zod';
import { OnlineUsersService } from '../onlineUser.service';
export function broadcastToConversation(
    server: Server,
    onlineUser: OnlineUsersService,
    participantUserId: string,
    event: string,
    payload: any,
) {
    const socketId = onlineUser.getSocketId(participantUserId);
    if (!socketId) {
        return;
    }
    console.log(socketId);
    
    server.to(socketId).emit(event, payload);
}

export function emitError(client: Socket, failedEvent: string, error: any) {
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