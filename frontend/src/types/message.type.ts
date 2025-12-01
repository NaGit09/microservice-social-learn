import type { File } from './common/file'
import type { Pagination } from './common/pagination'

export interface React {
  userId: string
  reactIcon: string
}
export interface NewMessage {
  convId: string
  content?: string
  senderId: string
  file?: File
  replyId?: string
}
export interface MessageResp {
  messages: Message[]
  pagination: Pagination
}
export interface Message {
  id: string
  convId: string
  senderId: string
  content?: string
  file?: File
  reply?: Message | null
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
  convId: string
  messageId: string
  react: React
}
export interface NewReactMessage {
  convId: string
  messageId: string
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