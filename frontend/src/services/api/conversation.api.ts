import type {
    AddUser,
    AvatarConversation,
  Conversation,
  CreateConversation,
  OwnerConversation,
  PinMessage,
  RenameConversation,
  UserBan,
} from '@/types/conversation.type'
import axiosInstance from '../axios.service'

export const CreateConversationApi = async (
  dto: CreateConversation
): Promise<Conversation> => {
  return await axiosInstance.post('/conversation/create', dto)
}

export const GetConversationsApi = async (userId : string) => {
    return await axiosInstance.get(`/conversation/${userId}/?page=1&limit=20`)
}

export const RenameConversationApi= async (dto : RenameConversation) => {
    return await axiosInstance.patch('/conversation/rename', dto)
}

export const PinMessageApi = async (dto: PinMessage) => {
    return await axiosInstance.patch('/conversation/pin',dto)
}

export const ChangeOwnerApi = async (dto: OwnerConversation) => {
    return await axiosInstance.patch('/conversation/owner', dto)
}

export const ChangeAvatarApi = async (dto: AvatarConversation) => {
    return await axiosInstance.patch('/conversation/avatar', dto)
}

export const BanUserApi = async (dto: UserBan) => {
    return await axiosInstance.patch('/conversation/ban', dto)
}

export const AddUserApi = async (dto: AddUser) => {
    return await axiosInstance.patch('/conversation/paticipants/add', dto)
}