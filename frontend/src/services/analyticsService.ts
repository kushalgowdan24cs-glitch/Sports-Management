import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '@/utils/constants';
import type {
  DashboardStats,
  AttendanceTrend,
  PerformanceTrendData,
  TeamComparisonData,
  RecentActivity,
} from '@/types/analytics.types';

export const analyticsService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const { data } = await axiosClient.get(API_ENDPOINTS.ANALYTICS.DASHBOARD);
    return data.data;
  },

  getAttendanceTrends: async (days = 30): Promise<AttendanceTrend[]> => {
    const { data } = await axiosClient.get(`${API_ENDPOINTS.ANALYTICS.ATTENDANCE_TRENDS}?days=${days}`);
    return data.data;
  },

  getPerformanceTrends: async (months = 6): Promise<PerformanceTrendData[]> => {
    const { data } = await axiosClient.get(`${API_ENDPOINTS.ANALYTICS.PERFORMANCE_TRENDS}?months=${months}`);
    return data.data;
  },

  getTeamComparison: async (): Promise<TeamComparisonData[]> => {
    const { data } = await axiosClient.get('/analytics/team-comparison');
    return data.data;
  },

  getRecentActivity: async (limit = 10): Promise<RecentActivity[]> => {
    const { data } = await axiosClient.get(`${API_ENDPOINTS.ANALYTICS.RECENT_ACTIVITY}?limit=${limit}`);
    return data.data;
  },
};
