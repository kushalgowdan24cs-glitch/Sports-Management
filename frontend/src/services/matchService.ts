import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '@/utils/constants';
import type { Match, MatchFormData } from '@/types/match.types';

export const matchService = {
  getMatches: async (filters: Record<string, string> = {}): Promise<Match[]> => {
    const params = new URLSearchParams(filters);
    const { data } = await axiosClient.get(`${API_ENDPOINTS.MATCHES.BASE}?${params}`);
    return data.data;
  },

  getMatch: async (id: string): Promise<Match> => {
    const { data } = await axiosClient.get(API_ENDPOINTS.MATCHES.BY_ID(id));
    return data.data;
  },

  createMatch: async (payload: MatchFormData): Promise<Match> => {
    const { data } = await axiosClient.post(API_ENDPOINTS.MATCHES.BASE, payload);
    return data.data;
  },

  updateMatch: async (id: string, payload: Partial<MatchFormData>): Promise<Match> => {
    const { data } = await axiosClient.put(API_ENDPOINTS.MATCHES.BY_ID(id), payload);
    return data.data;
  },

  deleteMatch: async (id: string): Promise<void> => {
    await axiosClient.delete(API_ENDPOINTS.MATCHES.BY_ID(id));
  },

  uploadMedia: async (id: string, files: File[], type: 'photo' | 'video'): Promise<string[]> => {
    const formData = new FormData();
    files.forEach(file => formData.append(type, file));
    const { data } = await axiosClient.post(`${API_ENDPOINTS.MATCHES.BY_ID(id)}/media`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data.urls;
  },
};
