import type { NotificationPagination } from '@/types/notification.type';
import axiosInstance from '../axios.service';

export const getNotifications = (
  userId: string,
  page: number,
  size: number
): Promise<NotificationPagination> => {
  return axiosInstance.get(`/notification/${userId}?page=${page}&size=${size}`);
};
