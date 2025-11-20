import { io, type Socket } from 'socket.io-client'
import type { ISocketConnection } from './socket.type'

export abstract class BaseConnection implements ISocketConnection {
  protected socket: Socket

    constructor(url: string, userId: string) {
      // Config to connect websocket 
    this.socket = io(url, {
      transports: ['websocket'],
      autoConnect: false,
      query: { userId },
    })
      this.setUpBaseEvent();
  }

    private setUpBaseEvent(): void {
    // sent connect request 
    this.socket.on('connect', () => {
      console.log(`✅ [${this.constructor.name}] Connected: ${this.socket.id}`)
      this.onConnect()
    })
    // receiver disconnect response
    this.socket.on('disconnect', (reason) => {
      console.log(`❌ [${this.constructor.name}] Disconnected: ${reason}`)
    })
  }
  
  public connection(): void {
    if (!this.socket.connected) {
      this.socket.connect()
    }
  }

  public disConnection(): void {
    if (this.socket.connected) {
      this.socket.disconnect()
    }
  }

  public getSocketId(): string | undefined {
    return this.socket.id
  }

  protected abstract onConnect(): void
}
