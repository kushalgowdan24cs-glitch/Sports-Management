// ─── Captain Mock Data Service ───────────────────────────────────────────────
// All functions return Promises simulating real API calls.
// Replace function bodies with real axios calls when backend is ready.

import type {
  CaptainDashboardStats,
  CaptainTeamPlayer,
  CaptainAttendanceData,
  CaptainPerformanceData,
  CaptainAnalyticsData,
  CaptainMatch,
  CaptainAnnouncement,
  CaptainFeedback,
} from '@/types/captain.types';

const delay = (ms = 400) => new Promise<void>((r) => setTimeout(r, ms));

// ── Mock Players ───────────────────────────────────────────────────────────────
const mockPlayers: CaptainTeamPlayer[] = [
  { id: 'p1', name: 'Arjun Sharma',   usn: '1RN21CS001', email: 'arjun@college.edu',   phone: '9876500001', department: 'Computer Science',   sport: 'Kabaddi',  playingRole: 'Raider',       year: '3rd Year', attendancePercentage: 92, performanceScore: 88, status: 'ACTIVE',   jerseyNumber: 1,  isInjured: false, lastActive: '2026-07-01' },
  { id: 'p2', name: 'Ravi Kumar',     usn: '1RN21EC002', email: 'ravi@college.edu',     phone: '9876500002', department: 'Electronics',         sport: 'Kabaddi',  playingRole: 'Defender',     year: '3rd Year', attendancePercentage: 85, performanceScore: 82, status: 'ACTIVE',   jerseyNumber: 2,  isInjured: false, lastActive: '2026-07-01' },
  { id: 'p3', name: 'Suresh Babu',    usn: '1RN22ME003', email: 'suresh@college.edu',   phone: '9876500003', department: 'Mechanical',          sport: 'Kabaddi',  playingRole: 'All-Rounder',  year: '2nd Year', attendancePercentage: 71, performanceScore: 74, status: 'ACTIVE',   jerseyNumber: 3,  isInjured: false, lastActive: '2026-06-30' },
  { id: 'p4', name: 'Kiran Rao',      usn: '1RN21CS004', email: 'kiran@college.edu',    phone: '9876500004', department: 'Computer Science',   sport: 'Kabaddi',  playingRole: 'Raider',       year: '3rd Year', attendancePercentage: 65, performanceScore: 70, status: 'ACTIVE',   jerseyNumber: 4,  isInjured: false, lastActive: '2026-06-28' },
  { id: 'p5', name: 'Deepak Singh',   usn: '1RN22CS005', email: 'deepak@college.edu',   phone: '9876500005', department: 'Computer Science',   sport: 'Kabaddi',  playingRole: 'Defender',     year: '2nd Year', attendancePercentage: 95, performanceScore: 91, status: 'ACTIVE',   jerseyNumber: 5,  isInjured: false, lastActive: '2026-07-01' },
  { id: 'p6', name: 'Vikram Patil',   usn: '1RN21EE006', email: 'vikram@college.edu',   phone: '9876500006', department: 'Electrical',          sport: 'Kabaddi',  playingRole: 'All-Rounder',  year: '3rd Year', attendancePercentage: 88, performanceScore: 85, status: 'ACTIVE',   jerseyNumber: 6,  isInjured: false, lastActive: '2026-07-01' },
  { id: 'p7', name: 'Rahul Nair',     usn: '1RN22CS007', email: 'rahul@college.edu',    phone: '9876500007', department: 'Computer Science',   sport: 'Kabaddi',  playingRole: 'Raider',       year: '2nd Year', attendancePercentage: 80, performanceScore: 78, status: 'INJURED',  jerseyNumber: 7,  isInjured: true,  lastActive: '2026-06-25' },
  { id: 'p8', name: 'Manoj Hegde',    usn: '1RN21ME008', email: 'manoj@college.edu',    phone: '9876500008', department: 'Mechanical',          sport: 'Kabaddi',  playingRole: 'Defender',     year: '3rd Year', attendancePercentage: 90, performanceScore: 83, status: 'ACTIVE',   jerseyNumber: 8,  isInjured: false, lastActive: '2026-07-01' },
  { id: 'p9', name: 'Prashanth R',   usn: '1RN22IT009', email: 'prash@college.edu',    phone: '9876500009', department: 'Information Technology', sport: 'Kabaddi', playingRole: 'All-Rounder', year: '2nd Year', attendancePercentage: 93, performanceScore: 89, status: 'ACTIVE',   jerseyNumber: 9,  isInjured: false, lastActive: '2026-07-01' },
  { id: 'p10', name: 'Akash Gowda',  usn: '1RN21CS010', email: 'akash@college.edu',    phone: '9876500010', department: 'Computer Science',   sport: 'Kabaddi',  playingRole: 'Defender',     year: '3rd Year', attendancePercentage: 76, performanceScore: 73, status: 'ACTIVE',   jerseyNumber: 10, isInjured: false, lastActive: '2026-06-30' },
  { id: 'p11', name: 'Sanjay Verma', usn: '1RN22CV011', email: 'sanjay@college.edu',   phone: '9876500011', department: 'Civil',               sport: 'Kabaddi',  playingRole: 'Raider',       year: '2nd Year', attendancePercentage: 84, performanceScore: 80, status: 'ACTIVE',   jerseyNumber: 11, isInjured: false, lastActive: '2026-07-01' },
  { id: 'p12', name: 'Harish Naik',  usn: '1RN21EC012', email: 'harish@college.edu',   phone: '9876500012', department: 'Electronics',         sport: 'Kabaddi',  playingRole: 'Defender',     year: '3rd Year', attendancePercentage: 87, performanceScore: 81, status: 'ACTIVE',   jerseyNumber: 12, isInjured: false, lastActive: '2026-07-01' },
];

// ── Dashboard Stats ────────────────────────────────────────────────────────────
export const captainService = {
  getStats: async (): Promise<CaptainDashboardStats> => {
    await delay();
    return {
      totalPlayers: 12,
      presentToday: 10,
      absentToday: 1,
      lateToday: 1,
      teamAvgPerformance: 81.5,
      upcomingMatches: 3,
      teamRanking: 2,
      teamAttendancePercentage: 84,
      trend: { attendance: 5, performance: 8 },
      nextMatch: 'vs SJCE — Jul 8, 2026',
      teamName: 'RNS Kabaddi Team',
    };
  },

  getPlayers: async (): Promise<CaptainTeamPlayer[]> => {
    await delay();
    return mockPlayers;
  },

  // ── Attendance ──────────────────────────────────────────────────────────────
  getAttendance: async (): Promise<CaptainAttendanceData> => {
    await delay();
    return {
      overallPercentage: 84,
      totalSessions: 42,
      lowAttendancePlayers: mockPlayers.filter(p => p.attendancePercentage < 75),
      teamSummary: [
        { date: '26 Jun', totalPlayers: 12, present: 11, absent: 1, late: 0, percentage: 92 },
        { date: '27 Jun', totalPlayers: 12, present: 9,  absent: 2, late: 1, percentage: 75 },
        { date: '28 Jun', totalPlayers: 12, present: 10, absent: 1, late: 1, percentage: 83 },
        { date: '29 Jun', totalPlayers: 12, present: 12, absent: 0, late: 0, percentage: 100 },
        { date: '30 Jun', totalPlayers: 12, present: 10, absent: 2, late: 0, percentage: 83 },
        { date: '01 Jul', totalPlayers: 12, present: 11, absent: 1, late: 0, percentage: 92 },
        { date: '02 Jul', totalPlayers: 12, present: 10, absent: 1, late: 1, percentage: 83 },
      ],
      records: [
        { id: 'r1',  playerId: 'p1',  playerName: 'Arjun Sharma',   usn: '1RN21CS001', teamName: 'RNS Kabaddi', date: '2026-07-02', status: 'PRESENT', sessionType: 'PRACTICE', remarks: '' },
        { id: 'r2',  playerId: 'p2',  playerName: 'Ravi Kumar',      usn: '1RN21EC002', teamName: 'RNS Kabaddi', date: '2026-07-02', status: 'PRESENT', sessionType: 'PRACTICE', remarks: '' },
        { id: 'r3',  playerId: 'p3',  playerName: 'Suresh Babu',     usn: '1RN22ME003', teamName: 'RNS Kabaddi', date: '2026-07-02', status: 'LATE',    sessionType: 'PRACTICE', remarks: 'Reached 15 min late' },
        { id: 'r4',  playerId: 'p4',  playerName: 'Kiran Rao',       usn: '1RN21CS004', teamName: 'RNS Kabaddi', date: '2026-07-02', status: 'ABSENT',  sessionType: 'PRACTICE', remarks: 'Medical leave' },
        { id: 'r5',  playerId: 'p5',  playerName: 'Deepak Singh',    usn: '1RN22CS005', teamName: 'RNS Kabaddi', date: '2026-07-02', status: 'PRESENT', sessionType: 'PRACTICE', remarks: '' },
        { id: 'r6',  playerId: 'p6',  playerName: 'Vikram Patil',    usn: '1RN21EE006', teamName: 'RNS Kabaddi', date: '2026-07-02', status: 'PRESENT', sessionType: 'PRACTICE', remarks: '' },
        { id: 'r7',  playerId: 'p7',  playerName: 'Rahul Nair',      usn: '1RN22CS007', teamName: 'RNS Kabaddi', date: '2026-07-02', status: 'ABSENT',  sessionType: 'PRACTICE', remarks: 'Injury rest' },
        { id: 'r8',  playerId: 'p8',  playerName: 'Manoj Hegde',     usn: '1RN21ME008', teamName: 'RNS Kabaddi', date: '2026-07-02', status: 'PRESENT', sessionType: 'PRACTICE', remarks: '' },
        { id: 'r9',  playerId: 'p9',  playerName: 'Prashanth R',     usn: '1RN22IT009', teamName: 'RNS Kabaddi', date: '2026-07-02', status: 'PRESENT', sessionType: 'PRACTICE', remarks: '' },
        { id: 'r10', playerId: 'p10', playerName: 'Akash Gowda',     usn: '1RN21CS010', teamName: 'RNS Kabaddi', date: '2026-07-02', status: 'PRESENT', sessionType: 'PRACTICE', remarks: '' },
        { id: 'r11', playerId: 'p11', playerName: 'Sanjay Verma',    usn: '1RN22CV011', teamName: 'RNS Kabaddi', date: '2026-07-02', status: 'PRESENT', sessionType: 'PRACTICE', remarks: '' },
        { id: 'r12', playerId: 'p12', playerName: 'Harish Naik',     usn: '1RN21EC012', teamName: 'RNS Kabaddi', date: '2026-07-02', status: 'PRESENT', sessionType: 'PRACTICE', remarks: '' },
        // Additional past records
        { id: 'r13', playerId: 'p4',  playerName: 'Kiran Rao',       usn: '1RN21CS004', teamName: 'RNS Kabaddi', date: '2026-07-01', status: 'ABSENT',  sessionType: 'PRACTICE', remarks: '' },
        { id: 'r14', playerId: 'p3',  playerName: 'Suresh Babu',     usn: '1RN22ME003', teamName: 'RNS Kabaddi', date: '2026-07-01', status: 'LATE',    sessionType: 'PRACTICE', remarks: '' },
        { id: 'r15', playerId: 'p7',  playerName: 'Rahul Nair',      usn: '1RN22CS007', teamName: 'RNS Kabaddi', date: '2026-07-01', status: 'ABSENT',  sessionType: 'FITNESS',  remarks: 'Knee injury recovery' },
      ],
      monthlyTrend: [
        { month: 'Feb', present: 10, absent: 2, late: 0, total: 12, percentage: 83 },
        { month: 'Mar', present: 11, absent: 1, late: 0, total: 12, percentage: 92 },
        { month: 'Apr', present: 10, absent: 1, late: 1, total: 12, percentage: 83 },
        { month: 'May', present: 12, absent: 0, late: 0, total: 12, percentage: 100 },
        { month: 'Jun', present: 10, absent: 1, late: 1, total: 12, percentage: 83 },
        { month: 'Jul', present: 10, absent: 1, late: 1, total: 12, percentage: 83 },
      ],
    };
  },

  // ── Performance ─────────────────────────────────────────────────────────────
  getPerformance: async (): Promise<CaptainPerformanceData> => {
    await delay();
    const scores = [
      { id: 's1', playerId: 'p5',  playerName: 'Deepak Singh',   date: '2026-07-02', performanceScore: 91, improvementScore: 8, errorScore: 3,  fitnessScore: 92, skillScore: 90, teamworkScore: 89, disciplineScore: 95, overallScore: 91, rank: 1,  trend: 'UP'     as const, lastUpdated: '2026-07-02T06:30:00Z', remarks: 'Excellent Performance' },
      { id: 's2', playerId: 'p9',  playerName: 'Prashanth R',    date: '2026-07-02', performanceScore: 89, improvementScore: 9, errorScore: 2,  fitnessScore: 88, skillScore: 91, teamworkScore: 90, disciplineScore: 92, overallScore: 89, rank: 2,  trend: 'UP'     as const, lastUpdated: '2026-07-02T06:30:00Z', remarks: 'Good Teamwork' },
      { id: 's3', playerId: 'p1',  playerName: 'Arjun Sharma',   date: '2026-07-02', performanceScore: 88, improvementScore: 7, errorScore: 4,  fitnessScore: 87, skillScore: 88, teamworkScore: 86, disciplineScore: 90, overallScore: 88, rank: 3,  trend: 'STABLE' as const, lastUpdated: '2026-07-02T06:30:00Z', remarks: '' },
      { id: 's4', playerId: 'p6',  playerName: 'Vikram Patil',   date: '2026-07-02', performanceScore: 85, improvementScore: 6, errorScore: 5,  fitnessScore: 84, skillScore: 86, teamworkScore: 87, disciplineScore: 88, overallScore: 85, rank: 4,  trend: 'UP'     as const, lastUpdated: '2026-07-02T06:30:00Z', remarks: '' },
      { id: 's5', playerId: 'p8',  playerName: 'Manoj Hegde',    date: '2026-07-02', performanceScore: 83, improvementScore: 5, errorScore: 5,  fitnessScore: 82, skillScore: 84, teamworkScore: 83, disciplineScore: 85, overallScore: 83, rank: 5,  trend: 'STABLE' as const, lastUpdated: '2026-07-02T06:30:00Z', remarks: '' },
      { id: 's6', playerId: 'p2',  playerName: 'Ravi Kumar',     date: '2026-07-02', performanceScore: 82, improvementScore: 6, errorScore: 6,  fitnessScore: 80, skillScore: 83, teamworkScore: 82, disciplineScore: 84, overallScore: 82, rank: 6,  trend: 'DOWN'   as const, lastUpdated: '2026-07-02T06:30:00Z', remarks: 'Needs Improvement' },
      { id: 's7', playerId: 'p12', playerName: 'Harish Naik',    date: '2026-07-02', performanceScore: 81, improvementScore: 7, errorScore: 6,  fitnessScore: 80, skillScore: 81, teamworkScore: 82, disciplineScore: 83, overallScore: 81, rank: 7,  trend: 'UP'     as const, lastUpdated: '2026-07-02T06:30:00Z', remarks: '' },
      { id: 's8', playerId: 'p11', playerName: 'Sanjay Verma',   date: '2026-07-02', performanceScore: 80, improvementScore: 8, errorScore: 5,  fitnessScore: 79, skillScore: 80, teamworkScore: 81, disciplineScore: 82, overallScore: 80, rank: 8,  trend: 'UP'     as const, lastUpdated: '2026-07-02T06:30:00Z', remarks: '' },
      { id: 's9', playerId: 'p3',  playerName: 'Suresh Babu',    date: '2026-07-02', performanceScore: 74, improvementScore: 5, errorScore: 8,  fitnessScore: 73, skillScore: 75, teamworkScore: 74, disciplineScore: 76, overallScore: 74, rank: 9,  trend: 'STABLE' as const, lastUpdated: '2026-07-02T06:30:00Z', remarks: 'Improve Defensive Skills' },
      { id: 's10', playerId: 'p10', playerName: 'Akash Gowda',   date: '2026-07-02', performanceScore: 73, improvementScore: 4, errorScore: 9,  fitnessScore: 72, skillScore: 74, teamworkScore: 73, disciplineScore: 75, overallScore: 73, rank: 10, trend: 'DOWN'   as const, lastUpdated: '2026-07-02T06:30:00Z', remarks: 'Needs Improvement' },
      { id: 's11', playerId: 'p4',  playerName: 'Kiran Rao',     date: '2026-07-01', performanceScore: 70, improvementScore: 4, errorScore: 10, fitnessScore: 69, skillScore: 71, teamworkScore: 70, disciplineScore: 72, overallScore: 70, rank: 11, trend: 'DOWN'   as const, lastUpdated: '2026-07-01T06:30:00Z', remarks: 'Needs Improvement' },
      { id: 's12', playerId: 'p7',  playerName: 'Rahul Nair',    date: '2026-07-01', performanceScore: 78, improvementScore: 6, errorScore: 7,  fitnessScore: 55, skillScore: 79, teamworkScore: 77, disciplineScore: 80, overallScore: 73, rank: 12, trend: 'DOWN'   as const, lastUpdated: '2026-07-01T06:30:00Z', remarks: 'Injury recovery — limited sessions' },
    ];

    return {
      players: scores,
      teamAverage: {
        overallScore: 81,
        performanceScore: 81,
        fitnessScore: 79,
        skillScore: 82,
        teamworkScore: 81,
        disciplineScore: 83,
      },
      topPerformer: mockPlayers.find(p => p.id === 'p5')!,
      mostImproved:  mockPlayers.find(p => p.id === 'p9')!,
      mostConsistent: mockPlayers.find(p => p.id === 'p1')!,
      needsAttention: mockPlayers.find(p => p.id === 'p4')!,
      monthlyTrend: [
        { month: 'Feb', teamAvg: 72, topScore: 85, lowestScore: 58 },
        { month: 'Mar', teamAvg: 75, topScore: 87, lowestScore: 61 },
        { month: 'Apr', teamAvg: 77, topScore: 89, lowestScore: 63 },
        { month: 'May', teamAvg: 79, topScore: 90, lowestScore: 65 },
        { month: 'Jun', teamAvg: 80, topScore: 91, lowestScore: 67 },
        { month: 'Jul', teamAvg: 81, topScore: 91, lowestScore: 70 },
      ],
    };
  },

  // ── Matches ─────────────────────────────────────────────────────────────────
  getMatches: async (): Promise<CaptainMatch[]> => {
    await delay();
    return [
      { id: 'm1', tournamentName: 'Inter-College Kabaddi Championship 2026', opponentTeam: 'SJCE', matchDate: 'Jul 8, 2026',  venue: 'RNS Indoor Hall, Bengaluru', sport: 'Kabaddi', result: 'UPCOMING', playersAvailable: 10, playersConfirmed: ['p1','p2','p5','p6','p8','p9','p11','p12'], playersUnavailable: ['p7'] },
      { id: 'm2', tournamentName: 'Inter-College Kabaddi Championship 2026', opponentTeam: 'NIT-K', matchDate: 'Jul 15, 2026', venue: 'NIT-K Sports Complex, Surathkal', sport: 'Kabaddi', result: 'UPCOMING', playersAvailable: 11, playersConfirmed: [], playersUnavailable: ['p7'] },
      { id: 'm3', tournamentName: 'Friendly Practice Match',                 opponentTeam: 'PESIT', matchDate: 'Jul 22, 2026', venue: 'PESIT Ground, Bengaluru',        sport: 'Kabaddi', result: 'UPCOMING', playersAvailable: 12, playersConfirmed: [], playersUnavailable: [] },
      { id: 'm4', tournamentName: 'District Kabaddi League 2026',            opponentTeam: 'RVCE',  matchDate: 'Jun 25, 2026', venue: 'RVCE Ground, Bengaluru',         sport: 'Kabaddi', result: 'WIN',  teamScore: 42, opponentScore: 35, playersAvailable: 12, playersConfirmed: [], playersUnavailable: [] },
      { id: 'm5', tournamentName: 'District Kabaddi League 2026',            opponentTeam: 'BMS',   matchDate: 'Jun 18, 2026', venue: 'BMS Campus, Bengaluru',           sport: 'Kabaddi', result: 'LOSS', teamScore: 30, opponentScore: 38, playersAvailable: 11, playersConfirmed: [], playersUnavailable: [] },
      { id: 'm6', tournamentName: 'District Kabaddi League 2026',            opponentTeam: 'MSR',   matchDate: 'Jun 10, 2026', venue: 'RNS Indoor Hall, Bengaluru',      sport: 'Kabaddi', result: 'WIN',  teamScore: 45, opponentScore: 28, playersAvailable: 12, playersConfirmed: [], playersUnavailable: [] },
    ];
  },

  // ── Announcements ────────────────────────────────────────────────────────────
  getAnnouncements: async (): Promise<CaptainAnnouncement[]> => {
    await delay();
    return [
      { id: 'a1', title: 'Practice Session at 6 AM Tomorrow',         message: 'All team members must report to the indoor hall by 6:00 AM sharp. Bring your gear and water bottles.',    category: 'PRACTICE', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), createdBy: 'Captain', targetAudience: 'TEAM' },
      { id: 'a2', title: 'Match vs SJCE on July 8',                   message: 'Our next match is on July 8 at the RNS Indoor Hall. Confirm your availability by July 5 evening.',        category: 'MATCH',    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), createdBy: 'Captain', targetAudience: 'TEAM' },
      { id: 'a3', title: 'Fitness Assessment This Friday',             message: 'A mandatory fitness assessment will be conducted on Friday at 5:30 PM. All players must participate.',     category: 'FITNESS',  createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), createdBy: 'Captain', targetAudience: 'TEAM' },
      { id: 'a4', title: 'URGENT: Extra Practice on Thursday',         message: 'Due to upcoming tournament, we will have an additional 2-hour practice session on Thursday morning.',      category: 'URGENT',   createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), createdBy: 'Captain', targetAudience: 'TEAM' },
      { id: 'a5', title: 'Team Dinner — Saturday Evening',             message: 'The coach has arranged a team dinner on Saturday at 7 PM. Attendance is appreciated.',                    category: 'GENERAL',  createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(), createdBy: 'Captain', targetAudience: 'TEAM' },
      { id: 'a6', title: 'New Practice Schedule for July',             message: 'Updated practice schedule for July: Mon/Wed/Fri — 6 AM to 8 AM. Tue/Thu — 5 PM to 7 PM.',               category: 'PRACTICE', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), createdBy: 'Captain', targetAudience: 'TEAM' },
    ];
  },

  // ── Feedback ─────────────────────────────────────────────────────────────────
  getFeedback: async (): Promise<CaptainFeedback[]> => {
    await delay();
    return [
      { id: 'f1',  playerId: 'p3',  playerName: 'Suresh Babu',  feedbackTitle: 'Improve Raid Timing',          remarks: 'Your raid timing needs improvement. Focus on the right moment to cross the baulk line.',    date: '2026-07-01', createdBy: 'Captain', category: 'SKILL' },
      { id: 'f2',  playerId: 'p9',  playerName: 'Prashanth R',  feedbackTitle: 'Good Defensive Effort',        remarks: 'Excellent defensive play today. Keep maintaining the ankle-hold technique.',                  date: '2026-07-01', createdBy: 'Captain', category: 'SKILL' },
      { id: 'f3',  playerId: 'p4',  playerName: 'Kiran Rao',    feedbackTitle: 'Work On Fitness',               remarks: 'Your endurance needs improvement. Please do additional running and stamina exercises daily.',  date: '2026-07-01', createdBy: 'Captain', category: 'FITNESS' },
      { id: 'f4',  playerId: 'p6',  playerName: 'Vikram Patil', feedbackTitle: 'Excellent All-Round Play',     remarks: 'Great performance in both raiding and defence. Continue the momentum.',                        date: '2026-06-30', createdBy: 'Captain', category: 'GENERAL' },
      { id: 'f5',  playerId: 'p2',  playerName: 'Ravi Kumar',   feedbackTitle: 'Improve Team Coordination',    remarks: 'Work on communication with teammates during the match. Call out positions loudly.',            date: '2026-06-30', createdBy: 'Captain', category: 'TEAMWORK' },
      { id: 'f6',  playerId: 'p10', playerName: 'Akash Gowda',  feedbackTitle: 'Discipline — Punctuality',     remarks: 'You have been late to practice three times this week. Punctuality is non-negotiable.',         date: '2026-06-29', createdBy: 'Captain', category: 'DISCIPLINE' },
      { id: 'f7',  playerId: 'p5',  playerName: 'Deepak Singh', feedbackTitle: 'Outstanding Performance',      remarks: 'Best performer this week. Your dedication is an inspiration to the team. Keep it up!',        date: '2026-06-29', createdBy: 'Captain', category: 'GENERAL' },
      { id: 'f8',  playerId: 'p11', playerName: 'Sanjay Verma', feedbackTitle: 'Good Improvement This Month',  remarks: 'Impressive improvement in raiding scores over the last month. Your hard work shows.',           date: '2026-06-28', createdBy: 'Captain', category: 'SKILL' },
    ];
  },

  // ── Analytics ─────────────────────────────────────────────────────────────
  getAnalytics: async (): Promise<CaptainAnalyticsData> => {
    await delay();
    return {
      attendanceTrend: [
        { month: 'Feb', percentage: 78, target: 90 },
        { month: 'Mar', percentage: 82, target: 90 },
        { month: 'Apr', percentage: 80, target: 90 },
        { month: 'May', percentage: 88, target: 90 },
        { month: 'Jun', percentage: 85, target: 90 },
        { month: 'Jul', percentage: 84, target: 90 },
      ],
      performanceTrend: [
        { month: 'Feb', teamAvg: 72, topPlayer: 85, lowestPlayer: 58 },
        { month: 'Mar', teamAvg: 75, topPlayer: 87, lowestPlayer: 61 },
        { month: 'Apr', teamAvg: 77, topPlayer: 89, lowestPlayer: 63 },
        { month: 'May', teamAvg: 79, topPlayer: 90, lowestPlayer: 65 },
        { month: 'Jun', teamAvg: 80, topPlayer: 91, lowestPlayer: 67 },
        { month: 'Jul', teamAvg: 81, topPlayer: 91, lowestPlayer: 70 },
      ],
      monthlyGrowth: [
        { month: 'Feb', growth: 0   },
        { month: 'Mar', growth: 4.2 },
        { month: 'Apr', growth: 2.7 },
        { month: 'May', growth: 2.6 },
        { month: 'Jun', growth: 1.3 },
        { month: 'Jul', growth: 1.3 },
      ],
      rankings: {
        topPerformers:  [
          { rank: 1, name: 'Deepak Singh',  score: 91, sport: 'Kabaddi' },
          { rank: 2, name: 'Prashanth R',   score: 89, sport: 'Kabaddi' },
          { rank: 3, name: 'Arjun Sharma',  score: 88, sport: 'Kabaddi' },
          { rank: 4, name: 'Vikram Patil',  score: 85, sport: 'Kabaddi' },
          { rank: 5, name: 'Manoj Hegde',   score: 83, sport: 'Kabaddi' },
        ],
        mostImproved: [
          { rank: 1, name: 'Prashanth R',   improvement: 9 },
          { rank: 2, name: 'Sanjay Verma',  improvement: 8 },
          { rank: 3, name: 'Arjun Sharma',  improvement: 7 },
          { rank: 4, name: 'Harish Naik',   improvement: 7 },
          { rank: 5, name: 'Vikram Patil',  improvement: 6 },
        ],
        bestAttendance: [
          { rank: 1, name: 'Deepak Singh',  percentage: 95 },
          { rank: 2, name: 'Prashanth R',   percentage: 93 },
          { rank: 3, name: 'Arjun Sharma',  percentage: 92 },
          { rank: 4, name: 'Vikram Patil',  percentage: 88 },
          { rank: 5, name: 'Harish Naik',   percentage: 87 },
        ],
        lowestAttendance: [
          { rank: 1, name: 'Kiran Rao',     percentage: 65 },
          { rank: 2, name: 'Suresh Babu',   percentage: 71 },
          { rank: 3, name: 'Akash Gowda',   percentage: 76 },
          { rank: 4, name: 'Rahul Nair',    percentage: 80 },
          { rank: 5, name: 'Ravi Kumar',    percentage: 85 },
        ],
      },
      teamComparison: [
        { metric: 'Performance', teamScore: 81, average: 75 },
        { metric: 'Fitness',     teamScore: 79, average: 73 },
        { metric: 'Skill',       teamScore: 82, average: 74 },
        { metric: 'Teamwork',    teamScore: 81, average: 76 },
        { metric: 'Discipline',  teamScore: 83, average: 77 },
        { metric: 'Attendance',  teamScore: 84, average: 78 },
      ],
    };
  },
};
