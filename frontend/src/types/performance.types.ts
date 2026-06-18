export interface PerformanceScore {
  id: string;
  playerId: string;
  playerName: string;
  matchId?: string;
  sessionId?: string;
  performanceScore: number;
  improvementScore: number;
  errorScore: number;
  fitnessScore: number;
  disciplineScore: number;
  teamworkScore: number;
  skillScore: number;
  overallScore: number;
  scoredBy: string;
  scoredAt: string;
}

export interface PlayerPerformance {
  playerId: string;
  playerName: string;
  playerPhoto?: string;
  sport: string;
  teamName: string;
  role: string;
  averagePerformance: number;
  averageImprovement: number;
  averageError: number;
  averageFitness: number;
  averageDiscipline: number;
  averageTeamwork: number;
  averageSkill: number;
  overallScore: number;
  rank: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface TeamLeaderboard {
  teamId: string;
  teamName: string;
  sport: string;
  averageScore: number;
  topPerformer: string;
  totalPlayers: number;
  rank: number;
}

export interface PerformanceTrend {
  month: string;
  averageScore: number;
  topScore: number;
  improvementRate: number;
}

export interface PerformanceFormData {
  playerId: string;
  matchId?: string;
  performanceScore: number;
  improvementScore: number;
  errorScore: number;
  fitnessScore: number;
  disciplineScore: number;
  teamworkScore: number;
  skillScore: number;
}
