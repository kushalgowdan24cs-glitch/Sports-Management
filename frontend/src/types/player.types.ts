export type PlayerRole = 'Raider' | 'Defender' | 'All-Rounder' | 'Striker' | 'Goalkeeper' | 'Midfielder' | 'Bowler' | 'Batsman' | 'Wicket-Keeper' | 'Other';

export type PlayerYear = '1st Year' | '2nd Year' | '3rd Year' | '4th Year';

export interface Player {
  id: string;
  userId: string;
  teamId: string;
  teamName: string;
  fullName: string;
  usn: string;
  email: string;
  phone: string;
  department: string;
  year: PlayerYear;
  sport: string;
  role: PlayerRole;
  isCaptain: boolean;
  isViceCaptain: boolean;
  photoUrl?: string;
  jerseyNumber?: number;
  bio?: string;
  joinedDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerFormData {
  fullName: string;
  usn: string;
  email: string;
  phone: string;
  department: string;
  year: PlayerYear;
  sport: string;
  teamId: string;
  role: PlayerRole;
  isCaptain: boolean;
  isViceCaptain: boolean;
  photoUrl?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface PlayerFilters {
  search?: string;
  sport?: string;
  team?: string;
  role?: string;
  year?: string;
  isCaptain?: boolean;
  page?: number;
  size?: number;
}
