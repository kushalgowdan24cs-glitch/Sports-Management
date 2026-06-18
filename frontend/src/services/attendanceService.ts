import axiosClient from './axiosClient';
import { API_ENDPOINTS } from '@/utils/constants';
import type {
  AttendanceSession,
  AttendanceRecord,
  AttendanceSummary,
  AttendanceFilters,
  PlayerAttendanceSummary,
} from '@/types/attendance.types';

export const attendanceService = {
  getSessions: async (filters: AttendanceFilters = {}): Promise<AttendanceSession[]> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, String(value));
    });
    const { data } = await axiosClient.get(`${API_ENDPOINTS.ATTENDANCE.SESSIONS}?${params}`);
    return data.data;
  },

  getSession: async (id: string): Promise<AttendanceSession> => {
    const { data } = await axiosClient.get(API_ENDPOINTS.ATTENDANCE.SESSION_BY_ID(id));
    return data.data;
  },

  createSession: async (payload: {
    teamId: string;
    sessionDate: string;
    sessionType: string;
  }): Promise<AttendanceSession> => {
    const { data } = await axiosClient.post(API_ENDPOINTS.ATTENDANCE.SESSIONS, payload);
    return data.data;
  },

  markAttendance: async (
    sessionId: string,
    records: Array<{ playerId: string; status: string; notes?: string }>,
  ): Promise<AttendanceRecord[]> => {
    const { data } = await axiosClient.post(API_ENDPOINTS.ATTENDANCE.MARK(sessionId), { records });
    return data.data;
  },

  getPlayerAttendance: async (playerId: string): Promise<PlayerAttendanceSummary> => {
    const { data } = await axiosClient.get(API_ENDPOINTS.ATTENDANCE.PLAYER(playerId));
    return data.data;
  },

  getTeamSummary: async (teamId: string): Promise<AttendanceSummary> => {
    const { data } = await axiosClient.get(API_ENDPOINTS.ATTENDANCE.TEAM_SUMMARY(teamId));
    return data.data;
  },
};
