import type { File } from './common/file'

export interface React {
  userId: string
  reactType: number
}
export interface NewMessage {
  convId: string
  content: string
  file: File
  senderId: string
}

export interface Message {
  id: string
  convId: string
  senderId: string
  content: string
  file: File
  reply: Message
  readBy: string[]
  isForward: boolean
  status: string
  reacts: React[]
  updatedAt: Date
}

export interface ReplyMessage {
  convId: string
  content: string
  senderId: string
  replyId: string
}

export interface ReactMessage {
  messageId: string
  senderId: string
  react: React
}

export interface RecallMessage {
  messageId: string
  userId: string
}

export interface ForwardMessage {
  convIds: string[]
  messageId: string
  userForward: string
}