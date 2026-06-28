// ─── Vice Captain TypeScript Types ─────────────────────────────────────────

// ── Dashboard Stats ──────────────────────────────────────────────────────────
export interface VCDashboardStats {
  totalPlayers: number;
  presentToday: number;
  absentToday: number;
  teamAvgPerformance: number;
  upcomingMatches: number;
  teamAttendancePercentage: number;
  trend: {
    attendance: number;
    performance: number;
  };
  nextMatch?: string;
}

// ── Player ────────────────────────────────────────────────────────────────────
export interface VCTeamPlayer {
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
  injuryType?: string;
  lastActive: string;
}

// ── Attendance ────────────────────────────────────────────────────────────────
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | 'NONE';

export interface VCAttendanceRecord {
  id: string;
  playerId: string;
  playerName: string;
  date: string;
  status: AttendanceStatus;
  sessionType: 'PRACTICE' | 'MATCH' | 'FITNESS';
  markedBy?: string;
  remarks?: string;
}

export interface VCTeamAttendanceSummary {
  date: string;
  totalPlayers: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  percentage: number;
}

export interface VCAttendanceData {
  teamSummary: VCTeamAttendanceSummary[];
  records: VCAttendanceRecord[];
  monthlyTrend: {
    month: string;
    present: number;
    absent: number;
    late: number;
    total: number;
    percentage: number;
  }[];
  lowAttendancePlayers: VCTeamPlayer[];
  overallPercentage: number;
  totalSessions: number;
}

// ── Performance ───────────────────────────────────────────────────────────────
export interface VCPerformanceScore {
  playerId: string;
  playerName: string;
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
}

export interface VCTeamPerformanceData {
  players: VCPerformanceScore[];
  teamAverage: {
    overallScore: number;
    fitnessScore: number;
    skillScore: number;
    teamworkScore: number;
    disciplineScore: number;
  };
  topPerformer: VCTeamPlayer;
  mostImproved: VCTeamPlayer;
  needsAttention: VCTeamPlayer;
  bestAttendance: VCTeamPlayer;
  monthlyTrend: {
    month: string;
    teamAvg: number;
    topScore: number;
    lowestScore: number;
  }[];
}

// ── Analytics ─────────────────────────────────────────────────────────────────
export interface VCAnalyticsData {
  attendanceTrend: {
    month: string;
    percentage: number;
    target: number;
  }[];
  performanceTrend: {
    month: string;
    teamAvg: number;
    topPlayer: number;
  }[];
  monthlyGrowth: {
    month: string;
    growth: number;
    players: number;
  }[];
  rankings: {
    topPerformers: { rank: number; name: string; score: number; sport: string }[];
    mostImproved: { rank: number; name: string; improvement: number; sport: string }[];
    bestAttendance: { rank: number; name: string; percentage: number; sport: string }[];
  };
}

// ── Match ─────────────────────────────────────────────────────────────────────
export interface VCMatch {
  id: string;
  tournamentName: string;
  opponentTeam: string;
  matchDate: string;
  venue: string;
  result?: 'WIN' | 'LOSS' | 'DRAW' | 'UPCOMING';
  teamScore?: number;
  opponentScore?: number;
  notes?: string;
  photoUrls?: string[];
  playersAvailable: number;
  playersInjured: number;
  playersAbsent: number;
  expectedLineup?: string[];
}

// ── Announcement ──────────────────────────────────────────────────────────────
export interface VCAnnouncement {
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
  category: VCAnnouncement['category'];
  targetAudience: VCAnnouncement['targetAudience'];
}

// ── Report ────────────────────────────────────────────────────────────────────
export interface VCReport {
  id: string;
  type: 'ATTENDANCE_SUMMARY' | 'PERFORMANCE_SUMMARY' | 'MATCH_PREP' | 'WEEKLY';
  title: string;
  generatedAt: string;
  generatedBy: string;
  period: string;
  status: 'DRAFT' | 'SUBMITTED' | 'REVIEWED';
  summary: string;
}

// ── Injury ────────────────────────────────────────────────────────────────────
export interface VCInjury {
  id: string;
  playerId: string;
  playerName: string;
  injuryType: string;
  injuryDate: string;
  recoveryStatus: 'ACTIVE' | 'RECOVERING' | 'RECOVERED';
  recoveryProgress: number;
  expectedReturnDate: string;
  treatedBy?: string;
  notes?: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE';
}

// ── Notification ──────────────────────────────────────────────────────────────
export interface VCNotification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ALERT';
  createdAt: string;
  isRead: boolean;
}
