export interface ISocketConnection {
    connection: () => void;
    disConnection: () => void;
    getSocketId(): string | undefined;
}

