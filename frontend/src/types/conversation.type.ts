import type { File } from './common/file'
import type { Pagination } from './common/pagination'

export interface ConversationPagination {
  conversations : Conversation[]
  pagination : Pagination
}

export interface Conversation {
  file: File
  participants: string[]
  isGroup: boolean
  name: string
  owner: string
  createdAt: string
  updatedAt: string
  lastest: {
    content: string
    senderId: string
  } | null
  status: string
  pin: string | null
  isBan: string[]
  id: string
}

export interface CreateConversation {
  participants: string[]
  isGroup: boolean
  name: string
  owner: string
  latest: {
    content: string
    senderId: string
  }
}

export interface EditConversation {
  convId: string
  userId: string
}

export interface RenameConversation extends EditConversation {
  newName: string;
}

export interface AvatarConversation extends EditConversation {
  file: File;
}

export interface OwnerConversation extends EditConversation  {
  newOwner: string;
}

export interface PinMessage extends EditConversation {
  messageId: string;
}

export interface UserBan extends EditConversation {
  userBan: string;
}

export interface AddUser   {
  convId: string;
  userIds : string[]
}

export interface ConversationResp {
  _id: string;
  name: string;
  participants: string[];
  lastest: null;
  status: string;
  owner: string;
  pin: null;
  isGroup: boolean;
  isBan: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}
