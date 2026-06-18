import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '@/utils/constants';
import type { Achievement, AchievementFormData } from '@/types/achievement.types';

export const achievementService = {
  getAchievements: async (filters: Record<string, string> = {}): Promise<Achievement[]> => {
    const params = new URLSearchParams(filters);
    const { data } = await axiosClient.get(`${API_ENDPOINTS.ACHIEVEMENTS.BASE}?${params}`);
    return data.data;
  },

  createAchievement: async (payload: AchievementFormData): Promise<Achievement> => {
    const { data } = await axiosClient.post(API_ENDPOINTS.ACHIEVEMENTS.BASE, payload);
    return data.data;
  },

  updateAchievement: async (id: string, payload: Partial<AchievementFormData>): Promise<Achievement> => {
    const { data } = await axiosClient.put(API_ENDPOINTS.ACHIEVEMENTS.BY_ID(id), payload);
    return data.data;
  },

  deleteAchievement: async (id: string): Promise<void> => {
    await axiosClient.delete(API_ENDPOINTS.ACHIEVEMENTS.BY_ID(id));
  },

  uploadCertificate: async (id: string, file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('certificate', file);
    const { data } = await axiosClient.post(`${API_ENDPOINTS.ACHIEVEMENTS.BY_ID(id)}/certificate`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data.certificateUrl;
  },
};
