// ─── Player-specific dashboard types ────────────────────────────────────────

export interface PlayerDashboardStats {
  performanceScore: number;
  attendancePercentage: number;
  teamRank: number;
  improvementScore: number;
  matchesPlayed: number;
  achievementsEarned: number;
  nextMatch: string;
  trend: {
    performance: number;   // % vs last month
    attendance: number;
    improvement: number;
  };
}

// ─── Attendance ──────────────────────────────────────────────────────────────
export type DayStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | 'NONE';

export interface DailyAttendanceRecord {
  date: string;           // ISO date YYYY-MM-DD
  status: DayStatus;
  sessionType: string;    // e.g. "PRACTICE"
  notes?: string;
}

export interface MonthlyAttendanceStat {
  month: string;          // e.g. "Jan", "Feb"
  present: number;
  absent: number;
  late: number;
  total: number;
  percentage: number;
}

export interface PlayerAttendanceData {
  totalSessions: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  attendancePercentage: number;
  currentStreak: number;
  records: DailyAttendanceRecord[];
  monthlyStats: MonthlyAttendanceStat[];
}

// ─── Performance ─────────────────────────────────────────────────────────────
export interface PerformanceScoreBreakdown {
  id: string;
  date: string;
  performanceScore: number;
  improvementScore: number;
  errorScore: number;
  fitnessScore: number;
  disciplineScore: number;
  teamworkScore: number;
  skillScore: number;
  overallScore: number;
  sessionType: string;
}

export interface WeeklyPerformance {
  week: string;
  score: number;
  fitness: number;
  teamwork: number;
}

export interface MonthlyPerformance {
  month: string;
  overall: number;
  fitness: number;
  skill: number;
  teamwork: number;
  discipline: number;
}

export interface PlayerPerformanceData {
  current: {
    performanceScore: number;
    improvementScore: number;
    errorScore: number;
    fitnessScore: number;
    disciplineScore: number;
    teamworkScore: number;
    skillScore: number;
    overallScore: number;
    rank: number;
    trend: 'UP' | 'DOWN' | 'STABLE';
  };
  history: PerformanceScoreBreakdown[];
  weeklyProgress: WeeklyPerformance[];
  monthlyProgress: MonthlyPerformance[];
  teamAverage: {
    overallScore: number;
    fitnessScore: number;
    skillScore: number;
    teamworkScore: number;
  };
}

// ─── Matches ─────────────────────────────────────────────────────────────────
export type MatchResult = 'WIN' | 'LOSS' | 'DRAW';

export interface PlayerMatchRecord {
  id: string;
  tournamentName: string;
  opponentName: string;
  matchDate: string;
  venue: string;
  result: MatchResult;
  teamScore: number;
  opponentScore: number;
  matchContribution: string;
  matchRating: number;       // 1–10
  specialAward?: string;
  photos?: string[];
  isManOfMatch: boolean;
}

// ─── Analytics ───────────────────────────────────────────────────────────────
export interface PerformanceGrowthPoint {
  month: string;
  score: number;
  teamAvg: number;
}

export interface ScoreComparisonPoint {
  month: string;
  current: number;
  previous: number;
  semester: number;
}

export interface PlayerAnalyticsData {
  performanceGrowth: PerformanceGrowthPoint[];
  attendanceTrend: MonthlyAttendanceStat[];
  scoreComparison: ScoreComparisonPoint[];
  insights: {
    mostImprovedMonth: string;
    strongestSkill: string;
    areasForImprovement: string[];
    performanceConsistency: number;  // 0–100
  };
}

// ─── Rankings ────────────────────────────────────────────────────────────────
export interface PlayerRankings {
  teamRank: number;
  teamSize: number;
  sportRank: number;
  sportSize: number;
  collegeRank: number | null;  // null = "Coming Soon"
}

// ─── Achievements ────────────────────────────────────────────────────────────
export type AchievementLevel = 'COLLEGE' | 'DISTRICT' | 'STATE' | 'NATIONAL' | 'INTERNATIONAL';
export type MedalType = 'GOLD' | 'SILVER' | 'BRONZE' | 'CERTIFICATE';

export interface PlayerAchievement {
  id: string;
  title: string;
  eventName: string;
  level: AchievementLevel;
  date: string;
  medalType: MedalType;
  certificateUrl?: string;
  description?: string;
}

// ─── Coach Feedback ──────────────────────────────────────────────────────────
export interface CoachFeedbackItem {
  id: string;
  title: string;
  remarks: string;
  date: string;
  category: 'PRAISE' | 'IMPROVEMENT' | 'GENERAL';
  coachName: string;
}

// ─── Injuries ────────────────────────────────────────────────────────────────
export type RecoveryStatus = 'ACTIVE' | 'RECOVERING' | 'RECOVERED' | 'CRITICAL';

export interface PlayerInjuryRecord {
  id: string;
  injuryType: string;
  injuryDate: string;
  recoveryStatus: RecoveryStatus;
  recoveryProgress: number;   // 0–100
  expectedReturnDate?: string;
  treatedBy?: string;
  notes?: string;
}
