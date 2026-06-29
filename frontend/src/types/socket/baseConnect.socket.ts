import { io, type Socket } from 'socket.io-client'
import type { ISocketConnection } from './socket.type'
import { CookieUtils } from '@/utils/cookie.util'

export abstract class BaseConnection implements ISocketConnection {
  protected socket: Socket

  constructor(url: string, userId: string) {
    let socketUrl = url;
    let socketPath = '/socket.io';

    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.pathname && parsedUrl.pathname !== '/') {
        socketUrl = parsedUrl.origin;
        socketPath = `${parsedUrl.pathname.replace(/\/$/, '')}/socket.io`;
      }
    } catch (e) {
      console.error('Invalid socket URL:', url, e);
    }

    const token = CookieUtils.get('accessToken')

    this.socket = io(socketUrl, {
      path: socketPath,
      transports: ['websocket'],
      autoConnect: false,
      query: { userId, jwt: token },
    });
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
