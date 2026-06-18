import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '@/utils/constants';
import type { Injury, InjuryFormData } from '@/types/injury.types';

export const injuryService = {
  getInjuries: async (filters: Record<string, string> = {}): Promise<Injury[]> => {
    const params = new URLSearchParams(filters);
    const { data } = await axiosClient.get(`${API_ENDPOINTS.INJURIES.BASE}?${params}`);
    return data.data;
  },

  getInjury: async (id: string): Promise<Injury> => {
    const { data } = await axiosClient.get(API_ENDPOINTS.INJURIES.BY_ID(id));
    return data.data;
  },

  createInjury: async (payload: InjuryFormData): Promise<Injury> => {
    const { data } = await axiosClient.post(API_ENDPOINTS.INJURIES.BASE, payload);
    return data.data;
  },

  updateInjury: async (id: string, payload: Partial<InjuryFormData>): Promise<Injury> => {
    const { data } = await axiosClient.put(API_ENDPOINTS.INJURIES.BY_ID(id), payload);
    return data.data;
  },

  deleteInjury: async (id: string): Promise<void> => {
    await axiosClient.delete(API_ENDPOINTS.INJURIES.BY_ID(id));
  },
};
