import type { File } from './common/file'
import type { Pagination } from './common/pagination'

export interface Notification {
  _id: string
  type: string
  actor: {
    id: string, 
    username: string,
    avatar : File
  }
  receiver: string
  entityType: string
  entityId: string
  metadata: {
    Content: string
  }
  isRead: boolean
  createdAt: string
  __v: number
}

export interface NotificationPagination {
  data: Notification[]
  pagination: Pagination
}
