export const APP_NAME = 'Sports Management System';

export const ROLES = {
  COACH: 'COACH',
  CAPTAIN: 'CAPTAIN',
  PLAYER: 'PLAYER',
} as const;

export const ROUTES = {
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    PROFILE: '/admin/profile',
    PLAYERS: '/admin/players',
    PLAYER_DETAIL: '/admin/players/:id',
    ATTENDANCE: '/admin/attendance',
    PERFORMANCE: '/admin/performance',
    ANALYTICS: '/admin/analytics',
    MATCHES: '/admin/matches',
    NOTIFICATIONS: '/admin/notifications',
    ACHIEVEMENTS: '/admin/achievements',
    INJURIES: '/admin/injuries',
    SETTINGS: '/admin/settings',
  },
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  PLAYERS: {
    BASE: '/players',
    BY_ID: (id: string) => `/players/${id}`,
    PHOTO: (id: string) => `/players/${id}/photo`,
    ROLE: (id: string) => `/players/${id}/role`,
    ME: '/players/me',
  },
  ATTENDANCE: {
    SESSIONS: '/attendance/sessions',
    SESSION_BY_ID: (id: string) => `/attendance/sessions/${id}`,
    MARK: (sessionId: string) => `/attendance/sessions/${sessionId}/mark`,
    PLAYER: (playerId: string) => `/attendance/players/${playerId}`,
    TEAM_SUMMARY: (teamId: string) => `/attendance/team/${teamId}/summary`,
  },
  PERFORMANCE: {
    SCORES: '/performance/scores',
    PLAYER: (id: string) => `/performance/players/${id}`,
    TEAM_LEADERBOARD: (teamId: string) => `/performance/team/${teamId}/leaderboard`,
  },
  MATCHES: {
    BASE: '/matches',
    BY_ID: (id: string) => `/matches/${id}`,
  },
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    ATTENDANCE_TRENDS: '/analytics/attendance-trends',
    PERFORMANCE_TRENDS: '/analytics/performance-trends',
    MATCH_STATS: '/analytics/match-stats',
    RECENT_ACTIVITY: '/analytics/recent-activity',
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    BY_ID: (id: string) => `/notifications/${id}`,
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    ANNOUNCEMENTS: '/notifications/announcements',
  },
  ACHIEVEMENTS: {
    BASE: '/achievements',
    BY_ID: (id: string) => `/achievements/${id}`,
  },
  INJURIES: {
    BASE: '/injuries',
    BY_ID: (id: string) => `/injuries/${id}`,
  },
  PROFILE: {
    BASE: '/profile',
    PHOTO: '/profile/photo',
  },
  TEAMS: {
    BASE: '/teams',
    BY_ID: (id: string) => `/teams/${id}`,
  },
} as const;

export const SPORTS = [
  'Cricket',
  'Football',
  'Basketball',
  'Volleyball',
  'Kabaddi',
  'Badminton',
  'Table Tennis',
  'Athletics',
  'Kho Kho',
  'Chess',
  'Wrestling',
  'Boxing',
  'Swimming',
  'Handball',
  'Hockey',
] as const;

export const DEPARTMENTS = [
  'Computer Science',
  'Electronics',
  'Mechanical',
  'Civil',
  'Electrical',
  'Information Technology',
  'Chemical',
  'Biotechnology',
  'MBA',
  'MCA',
  'Physics',
  'Mathematics',
  'Commerce',
  'Arts',
] as const;

export const PLAYER_ROLES = [
  'Raider',
  'Defender',
  'All-Rounder',
  'Striker',
  'Goalkeeper',
  'Midfielder',
  'Bowler',
  'Batsman',
  'Wicket-Keeper',
  'Other',
] as const;

export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'] as const;

export const ACHIEVEMENT_LEVELS = [
  'COLLEGE',
  'DISTRICT',
  'STATE',
  'NATIONAL',
  'INTERNATIONAL',
] as const;

export const INJURY_TYPES = [
  'Muscle Strain',
  'Ligament Tear',
  'Fracture',
  'Sprain',
  'Dislocation',
  'Concussion',
  'Hamstring Injury',
  'Knee Injury',
  'Shoulder Injury',
  'Back Pain',
  'Ankle Injury',
  'Other',
] as const;

export const ITEMS_PER_PAGE = 10;

export const SPORT_COLORS: Record<string, string> = {
  Cricket: '#10b981',
  Football: '#3b82f6',
  Basketball: '#f97316',
  Volleyball: '#8b5cf6',
  Kabaddi: '#ef4444',
  Badminton: '#f59e0b',
  'Table Tennis': '#06b6d4',
  Athletics: '#ec4899',
  'Kho Kho': '#84cc16',
  Chess: '#6366f1',
  Wrestling: '#d97706',
  Boxing: '#dc2626',
  Swimming: '#0ea5e9',
  Handball: '#7c3aed',
  Hockey: '#059669',
};
