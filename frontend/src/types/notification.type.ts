import type { Pagination } from './common/pagination'

export interface INotification {
  _id: string
  type: string
  actor: string
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
  data: INotification[]
  pagination: Pagination
}
