import { Conversation } from './conversation.type'
import { UserInfo } from './user.type'

export interface Message {
  _id: string
  conversation: Conversation
  sender: UserInfo
  content: string
  createdAt: string
  updatedAt: string
}

export interface CreateMessage {
  conversationId: string
  senderId: string
  content: string
}
