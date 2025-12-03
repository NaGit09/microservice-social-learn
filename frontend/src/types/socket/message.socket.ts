import type { ApiResponse } from '../common/api';
import type { Message, NewMessage, NewReactMessage } from '../message.type'
import { BaseConnection } from './baseConnect.socket'

export class MessageSocket extends BaseConnection {
  private messages: Message[];

  constructor(url: string, userId: string) {
    super(url, userId)
    this.messages = [];
  }
  protected onConnect(): void {
    console.log('🚀 Message System Ready')

    // subscrice event
    this.socket.on('receive_message', (msg: ApiResponse<Message>) => {
      this.messages.push(msg.data)
    })

    this.socket.on('message_reacted', (msg: ApiResponse<Message>) => {
      this.messages = this.messages.filter((m) => m.id !== msg.data.id)
      this.messages.push(msg.data)
    })


    this.socket.on('ws_error', (error) => {
      console.log(
        `🔥 ERROR: [ws_error] on event '${error.event}'. Details: ${error.details}`
      )
    })
  }
  public setMessage(messages: Message[]) {
    this.messages = messages;
  }
  // emit event
  public sendMessage(message: NewMessage) {

    this.socket.emit('send_message', message)
    const newMessage = {
      id: '',
      convId: message.convId,
      senderId: message.senderId,
      content: message.content,
      file: message.file,
      reply: message.replyId ? this.messages.find((msg) => msg.id === message.replyId) : null,
      readBy: [],
      isForward: false,
      status: 'sent',
      reacts: [],
      updatedAt: new Date(),
    }
    this.messages.push(newMessage)
  }

  public reactMessage(react: NewReactMessage) {
    this.socket.emit('react_message', react);
  }
}
