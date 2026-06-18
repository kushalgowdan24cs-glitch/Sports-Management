import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '@/utils/constants';
import type { Player, PlayerFormData, PaginatedResponse, PlayerFilters } from '@/types/player.types';

export const playerService = {
  getPlayers: async (filters: PlayerFilters = {}): Promise<PaginatedResponse<Player>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.append(key, String(value));
    });
    const { data } = await axiosClient.get(`${API_ENDPOINTS.PLAYERS.BASE}?${params}`);
    return data.data;
  },

  getPlayer: async (id: string): Promise<Player> => {
    const { data } = await axiosClient.get(API_ENDPOINTS.PLAYERS.BY_ID(id));
    return data.data;
  },

  createPlayer: async (payload: PlayerFormData): Promise<Player> => {
    const { data } = await axiosClient.post(API_ENDPOINTS.PLAYERS.BASE, payload);
    return data.data;
  },

  updatePlayer: async (id: string, payload: Partial<PlayerFormData>): Promise<Player> => {
    const { data } = await axiosClient.put(API_ENDPOINTS.PLAYERS.BY_ID(id), payload);
    return data.data;
  },

  deletePlayer: async (id: string): Promise<void> => {
    await axiosClient.delete(API_ENDPOINTS.PLAYERS.BY_ID(id));
  },

  uploadPhoto: async (id: string, file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('photo', file);
    const { data } = await axiosClient.post(API_ENDPOINTS.PLAYERS.PHOTO(id), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data.photoUrl;
  },

  assignRole: async (id: string, isCaptain: boolean, isViceCaptain: boolean): Promise<Player> => {
    const { data } = await axiosClient.patch(API_ENDPOINTS.PLAYERS.ROLE(id), { isCaptain, isViceCaptain });
    return data.data;
  },
};
