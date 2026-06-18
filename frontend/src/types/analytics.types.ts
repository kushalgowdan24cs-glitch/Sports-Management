export interface DashboardStats {
  totalPlayers: number;
  totalCaptains: number;
  totalViceCaptains: number;
  totalTeams: number;
  presentToday: number;
  absentToday: number;
  teamAverageScore: number;
  upcomingMatches: number;
  attendanceRate: number;
  totalMatches: number;
  wins: number;
}

export interface AttendanceTrend {
  date: string;
  present: number;
  absent: number;
  late: number;
  total: number;
  percentage: number;
}

export interface PerformanceTrendData {
  month: string;
  averageScore: number;
  topScore: number;
  fitnessScore: number;
  teamworkScore: number;
}

export interface TeamComparisonData {
  teamName: string;
  sport: string;
  averageScore: number;
  attendanceRate: number;
  wins: number;
  players: number;
}

export interface PlayerComparisonData {
  playerName: string;
  overallScore: number;
  fitnessScore: number;
  skillScore: number;
  teamworkScore: number;
  disciplineScore: number;
}

export interface BestPlayerWidget {
  category: string;
  playerName: string;
  playerPhoto?: string;
  sport: string;
  value: number;
  unit: string;
}

export interface RecentActivity {
  id: string;
  type: 'PLAYER_ADDED' | 'ATTENDANCE_MARKED' | 'MATCH_RESULT' | 'PERFORMANCE_SCORED' | 'ACHIEVEMENT' | 'INJURY';
  description: string;
  timestamp: string;
  userId?: string;
  userName?: string;
}
