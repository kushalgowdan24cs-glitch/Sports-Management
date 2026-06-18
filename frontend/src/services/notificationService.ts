import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '@/utils/constants';
import type { Notification, AnnouncementFormData } from '@/types/notification.types';

export const notificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    const { data } = await axiosClient.get(API_ENDPOINTS.NOTIFICATIONS.BASE);
    return data.data;
  },

  createAnnouncement: async (payload: AnnouncementFormData): Promise<Notification> => {
    const { data } = await axiosClient.post(API_ENDPOINTS.NOTIFICATIONS.ANNOUNCEMENTS, payload);
    return data.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await axiosClient.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
  },

  markAllAsRead: async (): Promise<void> => {
    await axiosClient.patch(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/read-all`);
  },

  deleteNotification: async (id: string): Promise<void> => {
    await axiosClient.delete(API_ENDPOINTS.NOTIFICATIONS.BY_ID(id));
  },

  getUnreadCount: async (): Promise<number> => {
    const { data } = await axiosClient.get(`${API_ENDPOINTS.NOTIFICATIONS.BASE}/unread-count`);
    return data.data.count;
  },
};
