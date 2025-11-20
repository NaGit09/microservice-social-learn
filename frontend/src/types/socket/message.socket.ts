import type { NewMessage, NewReactMessage } from '../message.type'
import { BaseConnection } from './baseConnect.socket'

export class MessageSocket extends BaseConnection {
  protected onConnect(): void {
    console.log('🚀 Message System Ready')

    // subscrice event
    this.socket.on('receive_message', (msg) => {
      console.log(`💬 IN: [receive_message] - ${JSON.stringify(msg, null, 2)}`)
    })

    this.socket.on('message_reacted', (msg) => {
      console.log(`💖 IN: [message_reacted] - ${JSON.stringify(msg, null, 2)}`)
    })

    this.socket.on('react_message_success', (data) => {
      console.log(
        `✅ SUCCESS: [react_message_success] - ${JSON.stringify(data, null, 2)}`
      )
    })

    this.socket.on('ws_error', (error) => {
      console.log(
        `🔥 ERROR: [ws_error] on event '${error.event}'. Details: ${error.details}`
      )
    })
  }

  // emit event
  public sendMessage(message: NewMessage) {
    this.socket.emit('send_message', message)
    console.log(`📤 OUT: [send_message] - ${JSON.stringify(message)}`)
  }

  public reactMessage(react: NewReactMessage) {
    this.socket.emit('react_message', react)
    console.log(`📤 OUT: [react_message] - ${JSON.stringify(react)}`)
  }
}
