export type AchievementLevel = 'COLLEGE' | 'DISTRICT' | 'STATE' | 'NATIONAL' | 'INTERNATIONAL';

export interface Achievement {
  id: string;
  title: string;
  eventName: string;
  level: AchievementLevel;
  date: string;
  teamId?: string;
  teamName?: string;
  playerId?: string;
  playerName?: string;
  certificateUrl?: string;
  description?: string;
  createdAt: string;
  createdBy: string;
}

export interface AchievementFormData {
  title: string;
  eventName: string;
  level: AchievementLevel;
  date: string;
  teamId?: string;
  playerId?: string;
  description?: string;
  certificateUrl?: string;
}
