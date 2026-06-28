/**
 * Vice Captain Dashboard Service — Frontend mock layer.
 * In production, replace each method body with an axiosClient call.
 */

import type {
  VCDashboardStats,
  VCTeamPlayer,
  VCAttendanceData,
  VCTeamPerformanceData,
  VCAnalyticsData,
  VCMatch,
  VCAnnouncement,
  VCReport,
  VCInjury,
} from '@/types/vice-captain.types';

const delay = (ms = 380) => new Promise(r => setTimeout(r, ms));

// ─── Mock player roster ───────────────────────────────────────────────────────
const MOCK_PLAYERS: VCTeamPlayer[] = [
  { id: 'p1',  name: 'Arjun Sharma',   usn: '1RN21CS101', email: 'arjun@college.edu',   phone: '9845123456', department: 'Computer Science',       sport: 'Kabaddi',   playingRole: 'Raider',      year: '3rd Year', attendancePercentage: 93, performanceScore: 88, status: 'ACTIVE',  isInjured: false, lastActive: '2026-06-25', jerseyNumber: 7  },
  { id: 'p2',  name: 'Ravi Kumar',     usn: '1RN21EC202', email: 'ravi@college.edu',     phone: '9876543210', department: 'Electronics',             sport: 'Kabaddi',   playingRole: 'Defender',    year: '3rd Year', attendancePercentage: 78, performanceScore: 72, status: 'ACTIVE',  isInjured: false, lastActive: '2026-06-24', jerseyNumber: 12 },
  { id: 'p3',  name: 'Priya Nair',     usn: '1RN22IS303', email: 'priya@college.edu',    phone: '9900112233', department: 'Information Technology', sport: 'Kabaddi',   playingRole: 'All-Rounder', year: '2nd Year', attendancePercentage: 96, performanceScore: 91, status: 'ACTIVE',  isInjured: false, lastActive: '2026-06-25', jerseyNumber: 3  },
  { id: 'p4',  name: 'Kiran Rao',      usn: '1RN21ME404', email: 'kiran@college.edu',    phone: '9812312312', department: 'Mechanical',              sport: 'Kabaddi',   playingRole: 'Raider',      year: '3rd Year', attendancePercentage: 60, performanceScore: 65, status: 'INJURED', isInjured: true, injuryType: 'Hamstring Strain', lastActive: '2026-06-15', jerseyNumber: 9  },
  { id: 'p5',  name: 'Sneha Reddy',    usn: '1RN22CS505', email: 'sneha@college.edu',    phone: '9823456789', department: 'Computer Science',       sport: 'Kabaddi',   playingRole: 'Defender',    year: '2nd Year', attendancePercentage: 88, performanceScore: 80, status: 'ACTIVE',  isInjured: false, lastActive: '2026-06-25', jerseyNumber: 5  },
  { id: 'p6',  name: 'Vikram Singh',   usn: '1RN21CV606', email: 'vikram@college.edu',   phone: '9834567890', department: 'Civil',                  sport: 'Kabaddi',   playingRole: 'All-Rounder', year: '4th Year', attendancePercentage: 85, performanceScore: 83, status: 'ACTIVE',  isInjured: false, lastActive: '2026-06-23', jerseyNumber: 11 },
  { id: 'p7',  name: 'Meena Patel',    usn: '1RN22EC707', email: 'meena@college.edu',    phone: '9845678901', department: 'Electronics',             sport: 'Kabaddi',   playingRole: 'Defender',    year: '2nd Year', attendancePercentage: 91, performanceScore: 86, status: 'ACTIVE',  isInjured: false, lastActive: '2026-06-25', jerseyNumber: 6  },
  { id: 'p8',  name: 'Suresh Babu',    usn: '1RN21IS808', email: 'suresh@college.edu',   phone: '9856789012', department: 'Information Technology', sport: 'Kabaddi',   playingRole: 'Raider',      year: '3rd Year', attendancePercentage: 70, performanceScore: 68, status: 'ACTIVE',  isInjured: false, lastActive: '2026-06-22', jerseyNumber: 14 },
  { id: 'p9',  name: 'Anjali Das',     usn: '1RN22ME909', email: 'anjali@college.edu',   phone: '9867890123', department: 'Mechanical',              sport: 'Kabaddi',   playingRole: 'All-Rounder', year: '2nd Year', attendancePercentage: 94, performanceScore: 89, status: 'ACTIVE',  isInjured: false, lastActive: '2026-06-25', jerseyNumber: 2  },
  { id: 'p10', name: 'Deepak Joshi',   usn: '1RN21CS010', email: 'deepak@college.edu',   phone: '9878901234', department: 'Computer Science',       sport: 'Kabaddi',   playingRole: 'Defender',    year: '4th Year', attendancePercentage: 82, performanceScore: 79, status: 'ACTIVE',  isInjured: false, lastActive: '2026-06-24', jerseyNumber: 8  },
  { id: 'p11', name: 'Pooja Menon',    usn: '1RN22CV111', email: 'pooja@college.edu',    phone: '9889012345', department: 'Civil',                  sport: 'Kabaddi',   playingRole: 'Raider',      year: '2nd Year', attendancePercentage: 97, performanceScore: 93, status: 'ACTIVE',  isInjured: false, lastActive: '2026-06-25', jerseyNumber: 1  },
  { id: 'p12', name: 'Harish Gowda',   usn: '1RN21EE212', email: 'harish@college.edu',   phone: '9890123456', department: 'Electrical',              sport: 'Kabaddi',   playingRole: 'Defender',    year: '3rd Year', attendancePercentage: 75, performanceScore: 71, status: 'ACTIVE',  isInjured: false, lastActive: '2026-06-21', jerseyNumber: 15 },
];

export const vcDashboardService = {

  // ── Dashboard Stats ─────────────────────────────────────────────────────────
  getStats: async (): Promise<VCDashboardStats> => {
    await delay();
    return {
      totalPlayers: 12,
      presentToday: 10,
      absentToday: 2,
      teamAvgPerformance: 80,
      upcomingMatches: 3,
      teamAttendancePercentage: 84,
      trend: { attendance: 5, performance: 8 },
      nextMatch: 'RNS vs BMS — Jul 2, 2026',
    };
  },

  // ── Team Players ────────────────────────────────────────────────────────────
  getPlayers: async (): Promise<VCTeamPlayer[]> => {
    await delay();
    return MOCK_PLAYERS;
  },

  // ── Attendance ──────────────────────────────────────────────────────────────
  getAttendance: async (): Promise<VCAttendanceData> => {
    await delay();
    const statuses = ['PRESENT','PRESENT','PRESENT','PRESENT','ABSENT','PRESENT','LATE','PRESENT','PRESENT','PRESENT'] as const;
    const records = MOCK_PLAYERS.flatMap((player, pi) =>
      Array.from({ length: 5 }, (_, i) => ({
        id: `att-${player.id}-${i}`,
        playerId: player.id,
        playerName: player.name,
        date: new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10),
        status: statuses[(pi + i) % statuses.length],
        sessionType: i % 3 === 0 ? 'MATCH' as const : i % 2 === 0 ? 'FITNESS' as const : 'PRACTICE' as const,
        markedBy: 'Vice Captain',
      }))
    );
    return {
      overallPercentage: 84,
      totalSessions: 60,
      records,
      teamSummary: Array.from({ length: 7 }, (_, i) => {
        const d = new Date(Date.now() - (6 - i) * 86_400_000);
        return {
          date: d.toISOString().slice(0, 10),
          totalPlayers: 12,
          present: 9 + Math.floor(Math.random() * 3),
          absent: 1 + Math.floor(Math.random() * 2),
          late: Math.floor(Math.random() * 2),
          excused: 0,
          percentage: 82 + Math.floor(Math.random() * 15),
        };
      }),
      monthlyTrend: [
        { month: 'Jan', present: 200, absent: 18, late: 14, total: 232, percentage: 86 },
        { month: 'Feb', present: 190, absent: 22, late: 10, total: 222, percentage: 86 },
        { month: 'Mar', present: 215, absent: 15, late: 10, total: 240, percentage: 90 },
        { month: 'Apr', present: 196, absent: 20, late: 16, total: 232, percentage: 85 },
        { month: 'May', present: 222, absent: 10, late:  8, total: 240, percentage: 93 },
        { month: 'Jun', present: 200, absent: 16, late: 12, total: 228, percentage: 88 },
      ],
      lowAttendancePlayers: MOCK_PLAYERS.filter(p => p.attendancePercentage < 75),
    };
  },

  // ── Performance ─────────────────────────────────────────────────────────────
  getPerformance: async (): Promise<VCTeamPerformanceData> => {
    await delay();
    const players = MOCK_PLAYERS.map((p, i) => ({
      playerId: p.id,
      playerName: p.name,
      performanceScore: p.performanceScore,
      improvementScore: 5 + (i % 8),
      errorScore: 5 + (i % 6),
      fitnessScore: p.performanceScore - 4,
      skillScore: p.performanceScore - 6,
      teamworkScore: p.performanceScore - 2,
      disciplineScore: p.attendancePercentage > 90 ? 92 : 78,
      overallScore: p.performanceScore,
      rank: i + 1,
      trend: (['UP', 'STABLE', 'DOWN'] as const)[i % 3],
      lastUpdated: '2026-06-20',
    })).sort((a, b) => b.overallScore - a.overallScore).map((p, i) => ({ ...p, rank: i + 1 }));

    return {
      players,
      teamAverage: { overallScore: 80, fitnessScore: 77, skillScore: 75, teamworkScore: 80, disciplineScore: 84 },
      topPerformer: MOCK_PLAYERS[10],    // Pooja Menon: 93
      mostImproved: MOCK_PLAYERS[2],     // Priya Nair: 91
      needsAttention: MOCK_PLAYERS[7],   // Suresh Babu: 68
      bestAttendance: MOCK_PLAYERS[10],  // Pooja Menon: 97%
      monthlyTrend: [
        { month: 'Jan', teamAvg: 74, topScore: 82, lowestScore: 60 },
        { month: 'Feb', teamAvg: 76, topScore: 85, lowestScore: 62 },
        { month: 'Mar', teamAvg: 77, topScore: 86, lowestScore: 63 },
        { month: 'Apr', teamAvg: 78, topScore: 88, lowestScore: 65 },
        { month: 'May', teamAvg: 79, topScore: 90, lowestScore: 66 },
        { month: 'Jun', teamAvg: 80, topScore: 93, lowestScore: 65 },
      ],
    };
  },

  // ── Analytics ───────────────────────────────────────────────────────────────
  getAnalytics: async (): Promise<VCAnalyticsData> => {
    await delay();
    return {
      attendanceTrend: [
        { month: 'Jan', percentage: 86, target: 90 },
        { month: 'Feb', percentage: 83, target: 90 },
        { month: 'Mar', percentage: 90, target: 90 },
        { month: 'Apr', percentage: 85, target: 90 },
        { month: 'May', percentage: 93, target: 90 },
        { month: 'Jun', percentage: 88, target: 90 },
      ],
      performanceTrend: [
        { month: 'Jan', teamAvg: 74, topPlayer: 82 },
        { month: 'Feb', teamAvg: 76, topPlayer: 85 },
        { month: 'Mar', teamAvg: 77, topPlayer: 86 },
        { month: 'Apr', teamAvg: 78, topPlayer: 88 },
        { month: 'May', teamAvg: 79, topPlayer: 90 },
        { month: 'Jun', teamAvg: 80, topPlayer: 93 },
      ],
      monthlyGrowth: [
        { month: 'Jan', growth: 2.1, players: 12 },
        { month: 'Feb', growth: 2.6, players: 12 },
        { month: 'Mar', growth: 1.3, players: 12 },
        { month: 'Apr', growth: 1.3, players: 12 },
        { month: 'May', growth: 1.3, players: 12 },
        { month: 'Jun', growth: 1.3, players: 12 },
      ],
      rankings: {
        topPerformers: [
          { rank: 1, name: 'Pooja Menon',  score: 93, sport: 'Kabaddi' },
          { rank: 2, name: 'Priya Nair',   score: 91, sport: 'Kabaddi' },
          { rank: 3, name: 'Arjun Sharma', score: 88, sport: 'Kabaddi' },
          { rank: 4, name: 'Anjali Das',   score: 89, sport: 'Kabaddi' },
          { rank: 5, name: 'Sneha Reddy',  score: 80, sport: 'Kabaddi' },
        ],
        mostImproved: [
          { rank: 1, name: 'Priya Nair',   improvement: 17, sport: 'Kabaddi' },
          { rank: 2, name: 'Pooja Menon',  improvement: 14, sport: 'Kabaddi' },
          { rank: 3, name: 'Anjali Das',   improvement: 12, sport: 'Kabaddi' },
          { rank: 4, name: 'Meena Patel',  improvement: 10, sport: 'Kabaddi' },
          { rank: 5, name: 'Arjun Sharma', improvement:  9, sport: 'Kabaddi' },
        ],
        bestAttendance: [
          { rank: 1, name: 'Pooja Menon',  percentage: 97, sport: 'Kabaddi' },
          { rank: 2, name: 'Priya Nair',   percentage: 96, sport: 'Kabaddi' },
          { rank: 3, name: 'Anjali Das',   percentage: 94, sport: 'Kabaddi' },
          { rank: 4, name: 'Arjun Sharma', percentage: 93, sport: 'Kabaddi' },
          { rank: 5, name: 'Meena Patel',  percentage: 91, sport: 'Kabaddi' },
        ],
      },
    };
  },

  // ── Matches ─────────────────────────────────────────────────────────────────
  getMatches: async (): Promise<VCMatch[]> => {
    await delay();
    return [
      { id: 'm1', tournamentName: 'VTU Kabaddi League',         opponentTeam: 'BMS College',     matchDate: '2026-07-02', venue: 'RNS Ground, Bangalore',  result: 'UPCOMING', playersAvailable: 11, playersInjured: 1, playersAbsent: 0, expectedLineup: ['Arjun Sharma', 'Priya Nair', 'Pooja Menon', 'Meena Patel', 'Anjali Das', 'Sneha Reddy', 'Vikram Singh'] },
      { id: 'm2', tournamentName: 'VTU Kabaddi League',         opponentTeam: 'SJBIT',           matchDate: '2026-07-10', venue: 'SJBIT Grounds',           result: 'UPCOMING', playersAvailable: 10, playersInjured: 1, playersAbsent: 1 },
      { id: 'm3', tournamentName: 'Inter-College Championship', opponentTeam: 'RVCE',            matchDate: '2026-06-15', venue: 'RVCE Arena',              result: 'WIN',      teamScore: 42, opponentScore: 35, playersAvailable: 12, playersInjured: 0, playersAbsent: 0, notes: 'Excellent team performance. Arjun was outstanding.' },
      { id: 'm4', tournamentName: 'Inter-College Championship', opponentTeam: 'PES University',  matchDate: '2026-06-05', venue: 'PES Campus',              result: 'WIN',      teamScore: 38, opponentScore: 30, playersAvailable: 11, playersInjured: 1, playersAbsent: 0 },
      { id: 'm5', tournamentName: 'State District Meet',        opponentTeam: 'City Sports Club', matchDate: '2026-05-20', venue: 'Kanteerava Stadium',     result: 'LOSS',     teamScore: 28, opponentScore: 34, playersAvailable: 10, playersInjured: 1, playersAbsent: 1, notes: 'Need to improve defensive plays.' },
      { id: 'm6', tournamentName: 'State District Meet',        opponentTeam: 'Bangalore Raiders', matchDate: '2026-05-10', venue: 'Kanteerava Stadium',  result: 'WIN',      teamScore: 40, opponentScore: 32, playersAvailable: 12, playersInjured: 0, playersAbsent: 0 },
    ];
  },

  // ── Announcements ───────────────────────────────────────────────────────────
  getAnnouncements: async (): Promise<VCAnnouncement[]> => {
    await delay();
    return [
      { id: 'an1', title: 'Practice Session Today',           message: 'Mandatory practice session at 5 PM on the main ground. All players must attend in full kit.',     category: 'PRACTICE', createdAt: '2026-06-25T08:00:00Z', createdBy: 'Vice Captain', targetAudience: 'TEAM' },
      { id: 'an2', title: 'Fitness Assessment Tomorrow',      message: 'Coach has scheduled a fitness assessment at 6 AM. Wear light sportswear and bring your water bottles.', category: 'FITNESS', createdAt: '2026-06-24T14:00:00Z', createdBy: 'Vice Captain', targetAudience: 'TEAM' },
      { id: 'an3', title: 'Match Reporting Time Updated',     message: 'Match vs BMS College on Jul 2nd — Reporting time moved to 7:30 AM (earlier than planned). Please confirm availability.', category: 'MATCH', createdAt: '2026-06-23T10:00:00Z', createdBy: 'Vice Captain', targetAudience: 'TEAM' },
      { id: 'an4', title: 'Urgent: Attendance Review',        message: 'Several players have attendance below 75%. Please review your attendance. This may affect match eligibility.', category: 'URGENT', createdAt: '2026-06-22T16:00:00Z', createdBy: 'Vice Captain', targetAudience: 'TEAM' },
      { id: 'an5', title: 'Team Meeting Friday',              message: 'Team meeting scheduled for Friday 6 PM in the sports room. Strategy discussion for upcoming VTU League.', category: 'GENERAL', createdAt: '2026-06-20T09:00:00Z', createdBy: 'Vice Captain', targetAudience: 'TEAM' },
    ];
  },

  createAnnouncement: async (data: { title: string; message: string; category: string; targetAudience: string }): Promise<VCAnnouncement> => {
    await delay(600);
    return {
      id: `an-${Date.now()}`,
      title: data.title,
      message: data.message,
      category: data.category as VCAnnouncement['category'],
      createdAt: new Date().toISOString(),
      createdBy: 'Vice Captain',
      targetAudience: data.targetAudience as VCAnnouncement['targetAudience'],
    };
  },

  // ── Reports ─────────────────────────────────────────────────────────────────
  getReports: async (): Promise<VCReport[]> => {
    await delay();
    return [
      { id: 'r1', type: 'WEEKLY',              title: 'Weekly Team Report — Week 25',        generatedAt: '2026-06-23', generatedBy: 'Vice Captain', period: 'Jun 17–23, 2026', status: 'SUBMITTED', summary: 'Team performed well with 88% attendance. 2 players flagged for low scores.' },
      { id: 'r2', type: 'ATTENDANCE_SUMMARY',  title: 'Monthly Attendance Summary — June',   generatedAt: '2026-06-20', generatedBy: 'Vice Captain', period: 'June 2026',       status: 'REVIEWED',  summary: '84% average team attendance. Kiran Rao and Suresh Babu need improvement.' },
      { id: 'r3', type: 'PERFORMANCE_SUMMARY', title: 'Performance Summary — Q2 2026',       generatedAt: '2026-06-15', generatedBy: 'Vice Captain', period: 'Apr–Jun 2026',    status: 'SUBMITTED', summary: 'Team average rose from 74 to 80 over the quarter. Top performer: Pooja Menon.' },
      { id: 'r4', type: 'MATCH_PREP',          title: 'Match Prep Report — vs BMS College',  generatedAt: '2026-06-28', generatedBy: 'Vice Captain', period: 'Jul 2026',        status: 'DRAFT',     summary: '11 players available, 1 injured. Kiran Rao not available for next match.' },
      { id: 'r5', type: 'WEEKLY',              title: 'Weekly Team Report — Week 24',        generatedAt: '2026-06-16', generatedBy: 'Vice Captain', period: 'Jun 10–16, 2026', status: 'REVIEWED',  summary: 'Strong week after championship win. Morale high, attendance at 92%.' },
    ];
  },

  // ── Injuries ────────────────────────────────────────────────────────────────
  getInjuries: async (): Promise<VCInjury[]> => {
    await delay();
    return [
      { id: 'i1', playerId: 'p4', playerName: 'Kiran Rao',    injuryType: 'Hamstring Strain', injuryDate: '2026-06-15', recoveryStatus: 'RECOVERING', recoveryProgress: 55, expectedReturnDate: '2026-07-05', treatedBy: 'Dr. Anand Physio',      notes: 'Moderate strain. On rest and physiotherapy.', severity: 'MODERATE' },
      { id: 'i2', playerId: 'p8', playerName: 'Suresh Babu',  injuryType: 'Ankle Sprain',     injuryDate: '2026-05-28', recoveryStatus: 'RECOVERED',  recoveryProgress: 100, expectedReturnDate: '2026-06-10', treatedBy: 'Dr. Priya Sports Medicine', notes: 'Fully recovered. Cleared for play.', severity: 'MILD' },
      { id: 'i3', playerId: 'p2', playerName: 'Ravi Kumar',   injuryType: 'Knee Inflammation', injuryDate: '2026-04-10', recoveryStatus: 'RECOVERED', recoveryProgress: 100, expectedReturnDate: '2026-05-01', treatedBy: 'Dr. Anand Physio',      notes: 'Minor inflammation, managed well.', severity: 'MILD' },
    ];
  },

};
