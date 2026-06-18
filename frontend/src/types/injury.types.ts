export type RecoveryStatus = 'ACTIVE' | 'RECOVERING' | 'RECOVERED' | 'CRITICAL';

export interface Injury {
  id: string;
  playerId: string;
  playerName: string;
  playerPhoto?: string;
  sport: string;
  injuryType: string;
  injuryDate: string;
  recoveryStatus: RecoveryStatus;
  expectedReturnDate?: string;
  notes?: string;
  treatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InjuryFormData {
  playerId: string;
  injuryType: string;
  injuryDate: string;
  recoveryStatus: RecoveryStatus;
  expectedReturnDate?: string;
  notes?: string;
  treatedBy?: string;
}
