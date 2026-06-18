export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
export type SessionType = 'PRACTICE' | 'MATCH' | 'TRAINING';

export interface AttendanceSession {
  id: string;
  teamId: string;
  teamName: string;
  sessionDate: string;
  sessionType: SessionType;
  markedBy: string;
  markedByName: string;
  createdAt: string;
  records: AttendanceRecord[];
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  playerId: string;
  playerName: string;
  playerPhoto?: string;
  status: AttendanceStatus;
  notes?: string;
}

export interface AttendanceSummary {
  teamId: string;
  teamName: string;
  totalSessions: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  attendancePercentage: number;
}

export interface PlayerAttendanceSummary {
  playerId: string;
  playerName: string;
  totalSessions: number;
  presentCount: number;
  absentCount: number;
  attendancePercentage: number;
  streak: number;
}

export interface MonthlyAttendance {
  month: string;
  present: number;
  absent: number;
  late: number;
  total: number;
  percentage: number;
}

export interface AttendanceFilters {
  teamId?: string;
  sport?: string;
  startDate?: string;
  endDate?: string;
  status?: AttendanceStatus;
}
