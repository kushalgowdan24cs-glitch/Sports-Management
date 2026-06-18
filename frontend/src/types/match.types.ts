export type MatchType = 'FRIENDLY' | 'LEAGUE' | 'TOURNAMENT';
export type MatchStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type MatchResult = 'WIN' | 'LOSS' | 'DRAW';

export interface Match {
  id: string;
  teamId: string;
  teamName: string;
  tournamentName?: string;
  opponentName: string;
  matchDate: string;
  venue: string;
  matchType: MatchType;
  status: MatchStatus;
  teamScore?: number;
  opponentScore?: number;
  result?: MatchResult;
  bestPlayerId?: string;
  bestPlayerName?: string;
  notes?: string;
  photos?: string[];
  videos?: string[];
  createdBy: string;
  createdAt: string;
}

export interface MatchFormData {
  teamId: string;
  tournamentName?: string;
  opponentName: string;
  matchDate: string;
  venue: string;
  matchType: MatchType;
  status: MatchStatus;
  teamScore?: number;
  opponentScore?: number;
  result?: MatchResult;
  bestPlayerId?: string;
  notes?: string;
}

export interface MatchStats {
  totalMatches: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  goalsScored: number;
  goalsConceded: number;
}
