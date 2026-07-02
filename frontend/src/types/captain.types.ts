// ─── Captain TypeScript Types ────────────────────────────────────────────────

// ── Dashboard Stats ───────────────────────────────────────────────────────────
export interface CaptainDashboardStats {
  totalPlayers: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  teamAvgPerformance: number;
  upcomingMatches: number;
  teamRanking: number;
  teamAttendancePercentage: number;
  trend: {
    attendance: number;
    performance: number;
  };
  nextMatch?: string;
  teamName: string;
}

// ── Player ─────────────────────────────────────────────────────────────────────
export interface CaptainTeamPlayer {
  id: string;
  name: string;
  usn: string;
  email: string;
  phone: string;
  department: string;
  sport: string;
  playingRole: string;
  year: string;
  attendancePercentage: number;
  performanceScore: number;
  status: 'ACTIVE' | 'INJURED' | 'SUSPENDED';
  photoUrl?: string;
  jerseyNumber?: number;
  isInjured: boolean;
  lastActive: string;
}

// ── Attendance ─────────────────────────────────────────────────────────────────
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'NONE';

export interface CaptainAttendanceRecord {
  id: string;
  playerId: string;
  playerName: string;
  usn: string;
  teamName: string;
  date: string;
  status: AttendanceStatus;
  sessionType: 'PRACTICE' | 'MATCH' | 'FITNESS';
  markedBy?: string;
  remarks?: string;
}

export interface CaptainTeamAttendanceSummary {
  date: string;
  totalPlayers: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

export interface CaptainAttendanceData {
  teamSummary: CaptainTeamAttendanceSummary[];
  records: CaptainAttendanceRecord[];
  monthlyTrend: {
    month: string;
    present: number;
    absent: number;
    late: number;
    total: number;
    percentage: number;
  }[];
  overallPercentage: number;
  totalSessions: number;
  lowAttendancePlayers: CaptainTeamPlayer[];
}

// ── Performance ────────────────────────────────────────────────────────────────
export interface CaptainPerformanceScore {
  id: string;
  playerId: string;
  playerName: string;
  date: string;
  performanceScore: number;
  improvementScore: number;
  errorScore: number;
  fitnessScore: number;
  skillScore: number;
  teamworkScore: number;
  disciplineScore: number;
  overallScore: number;
  rank: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  lastUpdated: string;
  remarks?: string;
}

export interface CaptainPerformanceData {
  players: CaptainPerformanceScore[];
  teamAverage: {
    overallScore: number;
    performanceScore: number;
    fitnessScore: number;
    skillScore: number;
    teamworkScore: number;
    disciplineScore: number;
  };
  topPerformer: CaptainTeamPlayer;
  mostImproved: CaptainTeamPlayer;
  mostConsistent: CaptainTeamPlayer;
  needsAttention: CaptainTeamPlayer;
  monthlyTrend: {
    month: string;
    teamAvg: number;
    topScore: number;
    lowestScore: number;
  }[];
}

export interface PerformanceEntryForm {
  playerId: string;
  date: string;
  performanceScore: number;
  improvementScore: number;
  errorScore: number;
  fitnessScore: number;
  skillScore: number;
  teamworkScore: number;
  disciplineScore: number;
  remarks: string;
}

// ── Analytics ──────────────────────────────────────────────────────────────────
export interface CaptainAnalyticsData {
  attendanceTrend: {
    month: string;
    percentage: number;
    target: number;
  }[];
  performanceTrend: {
    month: string;
    teamAvg: number;
    topPlayer: number;
    lowestPlayer: number;
  }[];
  monthlyGrowth: {
    month: string;
    growth: number;
  }[];
  rankings: {
    topPerformers: { rank: number; name: string; score: number; sport: string }[];
    mostImproved: { rank: number; name: string; improvement: number }[];
    bestAttendance: { rank: number; name: string; percentage: number }[];
    lowestAttendance: { rank: number; name: string; percentage: number }[];
  };
  teamComparison: {
    metric: string;
    teamScore: number;
    average: number;
  }[];
}

// ── Match ──────────────────────────────────────────────────────────────────────
export interface CaptainMatch {
  id: string;
  tournamentName: string;
  opponentTeam: string;
  matchDate: string;
  venue: string;
  sport: string;
  result?: 'WIN' | 'LOSS' | 'DRAW' | 'UPCOMING';
  teamScore?: number;
  opponentScore?: number;
  notes?: string;
  photoUrls?: string[];
  playersAvailable: number;
  playersConfirmed: string[];
  playersUnavailable: string[];
}

// ── Announcement ───────────────────────────────────────────────────────────────
export interface CaptainAnnouncement {
  id: string;
  title: string;
  message: string;
  category: 'PRACTICE' | 'MATCH' | 'FITNESS' | 'GENERAL' | 'URGENT';
  createdAt: string;
  createdBy: string;
  targetAudience: 'ALL' | 'TEAM';
  isRead?: boolean;
}

export interface CreateAnnouncementForm {
  title: string;
  message: string;
  category: CaptainAnnouncement['category'];
  targetAudience: CaptainAnnouncement['targetAudience'];
}

// ── Feedback ───────────────────────────────────────────────────────────────────
export interface CaptainFeedback {
  id: string;
  playerId: string;
  playerName: string;
  feedbackTitle: string;
  remarks: string;
  date: string;
  createdBy: string;
  category: 'SKILL' | 'FITNESS' | 'TEAMWORK' | 'DISCIPLINE' | 'GENERAL';
}

export interface CreateFeedbackForm {
  playerId: string;
  feedbackTitle: string;
  remarks: string;
  date: string;
  category: CaptainFeedback['category'];
}

// ── Notification ───────────────────────────────────────────────────────────────
export interface CaptainNotification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ALERT';
  createdAt: string;
  isRead: boolean;
}

// ── Recent Activity ────────────────────────────────────────────────────────────
export interface CaptainActivity {
  id: string;
  type: string;
  description: string;
  time: string;
  icon?: string;
}
