import type { NotificationPagination } from '@/types/notification.type';
import axiosInstance from '../axios.service';

export const getNotifications = (
  userId: string,
  page = 1,
  size = 10
): Promise<NotificationPagination> => {
  return axiosInstance.get(`/notification/${userId}?page=${page}&size=${size}`);
};
