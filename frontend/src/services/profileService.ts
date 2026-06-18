import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '@/utils/constants';
import type { CoachProfile } from '@/types/auth.types';

export const profileService = {
  getProfile: async (): Promise<CoachProfile> => {
    const { data } = await axiosClient.get(API_ENDPOINTS.PROFILE.BASE);
    return data.data;
  },

  updateProfile: async (payload: Partial<CoachProfile>): Promise<CoachProfile> => {
    const { data } = await axiosClient.put(API_ENDPOINTS.PROFILE.BASE, payload);
    return data.data;
  },

  uploadPhoto: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('photo', file);
    const { data } = await axiosClient.post(API_ENDPOINTS.PROFILE.PHOTO, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data.photoUrl;
  },
};
