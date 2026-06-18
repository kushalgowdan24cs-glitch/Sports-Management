import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '@/utils/constants';
import type { PerformanceScore, PlayerPerformance, TeamLeaderboard, PerformanceFormData } from '@/types/performance.types';

export const performanceService = {
  submitScore: async (payload: PerformanceFormData): Promise<PerformanceScore> => {
    const { data } = await axiosClient.post(API_ENDPOINTS.PERFORMANCE.SCORES, payload);
    return data.data;
  },

  getScores: async (filters: Record<string, string> = {}): Promise<PerformanceScore[]> => {
    const params = new URLSearchParams(filters);
    const { data } = await axiosClient.get(`${API_ENDPOINTS.PERFORMANCE.SCORES}?${params}`);
    return data.data;
  },

  getPlayerPerformance: async (playerId: string): Promise<PlayerPerformance> => {
    const { data } = await axiosClient.get(API_ENDPOINTS.PERFORMANCE.PLAYER(playerId));
    return data.data;
  },

  getTeamLeaderboard: async (teamId: string): Promise<TeamLeaderboard[]> => {
    const { data } = await axiosClient.get(API_ENDPOINTS.PERFORMANCE.TEAM_LEADERBOARD(teamId));
    return data.data;
  },

  updateScore: async (id: string, payload: Partial<PerformanceFormData>): Promise<PerformanceScore> => {
    const { data } = await axiosClient.put(`${API_ENDPOINTS.PERFORMANCE.SCORES}/${id}`, payload);
    return data.data;
  },

  deleteScore: async (id: string): Promise<void> => {
    await axiosClient.delete(`${API_ENDPOINTS.PERFORMANCE.SCORES}/${id}`);
  },
};
