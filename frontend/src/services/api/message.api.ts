import type {
  ForwardMessage,
  MessageResp,
  NewMessage,
  ReactMessage,
  RecallMessage,
  ReplyMessage,
} from '@/types/message.type'
import axiosInstance from '../axios.service'

export const GetMessages = (convId: string, userId: string , page: number , size: number) : Promise<MessageResp> => {
  return axiosInstance.get(
    `/messages/${convId}?userId=${userId}&page=${page}&size=${size}`
  )
}

export const CreteMessages = (dto: NewMessage) => {
  return axiosInstance.post('/messages/create', dto)
}

export const ReactMessages = (dto: ReactMessage) => {
  return axiosInstance.patch('/messages/react', dto)
}

export const RecallMessages = (dto: RecallMessage) => {
  return axiosInstance.patch('/messages/recall', dto)
}

export const ForwardMessages = (dto: ForwardMessage) => {
  return axiosInstance.post('/messages/forward', dto)
}
export const ReplyMessages = (dto: ReplyMessage) => {
  return axiosInstance.post('/messages/create', dto)
}
