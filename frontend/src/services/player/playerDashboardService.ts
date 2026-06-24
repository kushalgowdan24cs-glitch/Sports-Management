/**
 * Player Dashboard Service — Frontend mock layer.
 * In production, replace each method body with an axiosClient call.
 */

import type {
  PlayerDashboardStats,
  PlayerAttendanceData,
  PlayerPerformanceData,
  PlayerMatchRecord,
  PlayerAnalyticsData,
  PlayerRankings,
  PlayerAchievement,
  CoachFeedbackItem,
  PlayerInjuryRecord,
} from '@/types/player.dashboard.types';

const delay = (ms = 350) => new Promise(r => setTimeout(r, ms));

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export const playerDashboardService = {

  getStats: async (): Promise<PlayerDashboardStats> => {
    await delay();
    return {
      performanceScore: 88,
      attendancePercentage: 93,
      teamRank: 4,
      improvementScore: 12,
      matchesPlayed: 14,
      achievementsEarned: 7,
      nextMatch: 'RNS vs BMS — Jul 2, 2026',
      trend: { performance: 8, attendance: 3, improvement: 12 },
    };
  },

  // ─── Attendance ─────────────────────────────────────────────────────────────
  getAttendance: async (): Promise<PlayerAttendanceData> => {
    await delay();
    const records = [];
    const statuses = ['PRESENT','PRESENT','PRESENT','PRESENT','ABSENT','PRESENT','LATE','PRESENT','PRESENT','PRESENT'] as const;
    for (let i = 0; i < 30; i++) {
      const d = new Date('2026-06-01');
      d.setDate(d.getDate() + i - 29);
      records.push({
        date: d.toISOString().slice(0, 10),
        status: statuses[i % statuses.length],
        sessionType: i % 5 === 0 ? 'MATCH' : 'PRACTICE',
      });
    }
    return {
      totalSessions: 60,
      presentDays: 56,
      absentDays: 3,
      lateDays: 4,
      attendancePercentage: 93,
      currentStreak: 11,
      records,
      monthlyStats: [
        { month: 'Jan', present: 18, absent: 0, late: 2, total: 20, percentage: 90 },
        { month: 'Feb', present: 16, absent: 2, late: 0, total: 18, percentage: 89 },
        { month: 'Mar', present: 19, absent: 0, late: 1, total: 20, percentage: 95 },
        { month: 'Apr', present: 17, absent: 1, late: 2, total: 20, percentage: 85 },
        { month: 'May', present: 20, absent: 0, late: 0, total: 20, percentage: 100 },
        { month: 'Jun', present: 18, absent: 1, late: 1, total: 20, percentage: 90 },
      ],
    };
  },

  // ─── Performance ────────────────────────────────────────────────────────────
  getPerformance: async (): Promise<PlayerPerformanceData> => {
    await delay();
    return {
      current: {
        performanceScore: 88,
        improvementScore: 12,
        errorScore: 8,
        fitnessScore: 84,
        disciplineScore: 91,
        teamworkScore: 86,
        skillScore: 82,
        overallScore: 88,
        rank: 4,
        trend: 'UP',
      },
      history: [
        { id: 'ps1', date: '2026-05-20', performanceScore: 82, improvementScore: 10, errorScore: 12, fitnessScore: 80, disciplineScore: 88, teamworkScore: 84, skillScore: 78, overallScore: 82, sessionType: 'PRACTICE' },
        { id: 'ps2', date: '2026-05-28', performanceScore: 85, improvementScore: 11, errorScore: 10, fitnessScore: 82, disciplineScore: 89, teamworkScore: 85, skillScore: 80, overallScore: 85, sessionType: 'MATCH' },
        { id: 'ps3', date: '2026-06-05', performanceScore: 87, improvementScore: 12, errorScore: 9, fitnessScore: 83, disciplineScore: 90, teamworkScore: 85, skillScore: 81, overallScore: 87, sessionType: 'PRACTICE' },
        { id: 'ps4', date: '2026-06-14', performanceScore: 88, improvementScore: 12, errorScore: 8, fitnessScore: 84, disciplineScore: 91, teamworkScore: 86, skillScore: 82, overallScore: 88, sessionType: 'MATCH' },
      ],
      weeklyProgress: [
        { week: 'W1', score: 80, fitness: 78, teamwork: 82 },
        { week: 'W2', score: 83, fitness: 80, teamwork: 84 },
        { week: 'W3', score: 85, fitness: 82, teamwork: 85 },
        { week: 'W4', score: 87, fitness: 83, teamwork: 85 },
        { week: 'W5', score: 88, fitness: 84, teamwork: 86 },
      ],
      monthlyProgress: [
        { month: 'Jan', overall: 75, fitness: 72, skill: 70, teamwork: 78, discipline: 80 },
        { month: 'Feb', overall: 78, fitness: 75, skill: 73, teamwork: 80, discipline: 82 },
        { month: 'Mar', overall: 80, fitness: 78, skill: 76, teamwork: 82, discipline: 85 },
        { month: 'Apr', overall: 83, fitness: 80, skill: 78, teamwork: 84, discipline: 87 },
        { month: 'May', overall: 85, fitness: 82, skill: 80, teamwork: 85, discipline: 89 },
        { month: 'Jun', overall: 88, fitness: 84, skill: 82, teamwork: 86, discipline: 91 },
      ],
      teamAverage: { overallScore: 79, fitnessScore: 77, skillScore: 75, teamworkScore: 80 },
    };
  },

  // ─── Matches ────────────────────────────────────────────────────────────────
  getMatches: async (): Promise<PlayerMatchRecord[]> => {
    await delay();
    return [
      { id: 'm1', tournamentName: 'Inter-College Championship', opponentName: 'BMS College', matchDate: '2026-06-10', venue: 'RNS Ground, Bangalore', result: 'WIN', teamScore: 42, opponentScore: 35, matchContribution: 'Scored 8 raid points, 3 tackles', matchRating: 9, specialAward: 'Man of the Match', isManOfMatch: true },
      { id: 'm2', tournamentName: 'Inter-College Championship', opponentName: 'SJBIT', matchDate: '2026-05-25', venue: 'SJBIT Grounds', result: 'WIN', teamScore: 38, opponentScore: 30, matchContribution: 'Scored 6 raid points, 2 tackles', matchRating: 8, isManOfMatch: false },
      { id: 'm3', tournamentName: 'VTU Kabaddi League', opponentName: 'RVCE', matchDate: '2026-05-10', venue: 'RVCE Arena', result: 'LOSS', teamScore: 28, opponentScore: 34, matchContribution: 'Scored 5 raid points', matchRating: 6, isManOfMatch: false },
      { id: 'm4', tournamentName: 'VTU Kabaddi League', opponentName: 'PES University', matchDate: '2026-04-22', venue: 'PES Campus', result: 'WIN', teamScore: 40, opponentScore: 32, matchContribution: 'Scored 9 raid points, 4 tackles', matchRating: 9, specialAward: 'Best Raider', isManOfMatch: false },
      { id: 'm5', tournamentName: 'State District Meet', opponentName: 'City Sports Club', matchDate: '2026-04-05', venue: 'Kanteerava Stadium', result: 'WIN', teamScore: 45, opponentScore: 28, matchContribution: 'Scored 11 raid points, 5 tackles', matchRating: 10, specialAward: 'Man of the Match', isManOfMatch: true },
      { id: 'm6', tournamentName: 'State District Meet', opponentName: 'Bangalore Raiders', matchDate: '2026-03-18', venue: 'Kanteerava Stadium', result: 'DRAW', teamScore: 30, opponentScore: 30, matchContribution: 'Scored 7 raid points, 2 tackles', matchRating: 7, isManOfMatch: false },
    ];
  },

  // ─── Analytics ──────────────────────────────────────────────────────────────
  getAnalytics: async (): Promise<PlayerAnalyticsData> => {
    await delay();
    return {
      performanceGrowth: [
        { month: 'Jan', score: 75, teamAvg: 72 },
        { month: 'Feb', score: 78, teamAvg: 73 },
        { month: 'Mar', score: 80, teamAvg: 75 },
        { month: 'Apr', score: 83, teamAvg: 76 },
        { month: 'May', score: 85, teamAvg: 77 },
        { month: 'Jun', score: 88, teamAvg: 79 },
      ],
      attendanceTrend: [
        { month: 'Jan', present: 18, absent: 0, late: 2, total: 20, percentage: 90 },
        { month: 'Feb', present: 16, absent: 2, late: 0, total: 18, percentage: 89 },
        { month: 'Mar', present: 19, absent: 0, late: 1, total: 20, percentage: 95 },
        { month: 'Apr', present: 17, absent: 1, late: 2, total: 20, percentage: 85 },
        { month: 'May', present: 20, absent: 0, late: 0, total: 20, percentage: 100 },
        { month: 'Jun', present: 18, absent: 1, late: 1, total: 20, percentage: 90 },
      ],
      scoreComparison: [
        { month: 'Jan', current: 75, previous: 68, semester: 70 },
        { month: 'Feb', current: 78, previous: 72, semester: 70 },
        { month: 'Mar', current: 80, previous: 73, semester: 70 },
        { month: 'Apr', current: 83, previous: 75, semester: 70 },
        { month: 'May', current: 85, previous: 78, semester: 70 },
        { month: 'Jun', current: 88, previous: 80, semester: 70 },
      ],
      insights: {
        mostImprovedMonth: 'June 2026',
        strongestSkill: 'Discipline',
        areasForImprovement: ['Reaction Speed', 'Defensive Tackles', 'Cross-court Coverage'],
        performanceConsistency: 88,
      },
    };
  },

  // ─── Rankings ───────────────────────────────────────────────────────────────
  getRankings: async (): Promise<PlayerRankings> => {
    await delay();
    return { teamRank: 4, teamSize: 16, sportRank: 12, sportSize: 80, collegeRank: null };
  },

  // ─── Achievements ────────────────────────────────────────────────────────────
  getAchievements: async (): Promise<PlayerAchievement[]> => {
    await delay();
    return [
      { id: 'a1', title: 'Best Raider Award', eventName: 'State District Kabaddi Meet', level: 'STATE', date: '2026-04-05', medalType: 'GOLD', description: 'Awarded for top raiding performance across all matches.' },
      { id: 'a2', title: 'Man of the Match', eventName: 'Inter-College Championship Final', level: 'COLLEGE', date: '2026-06-10', medalType: 'GOLD', description: 'Outstanding performance in the championship final.' },
      { id: 'a3', title: 'VTU Gold Medal', eventName: 'VTU Kabaddi League 2026', level: 'STATE', date: '2026-05-15', medalType: 'GOLD', description: 'Won gold in the VTU inter-university league.' },
      { id: 'a4', title: 'District Champions', eventName: 'District Kabaddi Tournament', level: 'DISTRICT', date: '2026-02-20', medalType: 'GOLD', description: 'Team won the district championship.' },
      { id: 'a5', title: 'College Best Athlete', eventName: 'Annual Sports Day 2025', level: 'COLLEGE', date: '2025-12-15', medalType: 'GOLD', description: 'Recognized as the best athlete of the year.' },
      { id: 'a6', title: 'Silver — Nationals', eventName: 'National Kabaddi Championship', level: 'NATIONAL', date: '2025-09-10', medalType: 'SILVER', description: 'Represented college at nationals, finished runner-up.' },
      { id: 'a7', title: 'Discipline Award', eventName: 'Annual Sports Day 2026', level: 'COLLEGE', date: '2026-01-10', medalType: 'CERTIFICATE', description: 'Recognized for exceptional discipline and attendance.' },
    ];
  },

  // ─── Coach Feedback ──────────────────────────────────────────────────────────
  getFeedback: async (): Promise<CoachFeedbackItem[]> => {
    await delay();
    return [
      { id: 'f1', title: 'Excellent Month — June', remarks: 'Outstanding discipline this month. Keep up the consistency in attendance and performance. Your raiding has improved significantly.', date: '2026-06-15', category: 'PRAISE', coachName: 'Dr. Ramesh Kumar' },
      { id: 'f2', title: 'Defensive Focus Needed', remarks: 'Work on your defensive tackles. You tend to miss the opponent when they use cross-court movements. Practice more anti-raid drills.', date: '2026-06-01', category: 'IMPROVEMENT', coachName: 'Dr. Ramesh Kumar' },
      { id: 'f3', title: 'Reaction Speed', remarks: 'Improve reaction speed during surprise raids. Consider specific agility drills three times a week.', date: '2026-05-20', category: 'IMPROVEMENT', coachName: 'Dr. Ramesh Kumar' },
      { id: 'f4', title: 'Championship Final Review', remarks: 'Great performance in the final. Man of the Match was well deserved. Continue with the same energy.', date: '2026-06-10', category: 'PRAISE', coachName: 'Dr. Ramesh Kumar' },
      { id: 'f5', title: 'Pre-Season Preparation', remarks: 'Good preparation during pre-season. Your fitness levels are on track. Focus on nutrition during summer training.', date: '2026-04-01', category: 'GENERAL', coachName: 'Dr. Ramesh Kumar' },
      { id: 'f6', title: 'VTU League Debrief', remarks: 'You played well in the league. Your stamina held up across back-to-back matches. One area: communication with team during pressure moments.', date: '2026-05-16', category: 'GENERAL', coachName: 'Dr. Ramesh Kumar' },
    ];
  },

  // ─── Injuries ────────────────────────────────────────────────────────────────
  getInjuries: async (): Promise<PlayerInjuryRecord[]> => {
    await delay();
    return [
      { id: 'i1', injuryType: 'Hamstring Strain', injuryDate: '2026-03-12', recoveryStatus: 'RECOVERED', recoveryProgress: 100, expectedReturnDate: '2026-04-01', treatedBy: 'Dr. Anand Physio', notes: 'Mild strain, recovered with rest and physiotherapy.' },
      { id: 'i2', injuryType: 'Ankle Sprain', injuryDate: '2025-11-20', recoveryStatus: 'RECOVERED', recoveryProgress: 100, expectedReturnDate: '2025-12-10', treatedBy: 'Dr. Anand Physio', notes: 'Grade I sprain, treated with RICE protocol.' },
      { id: 'i3', injuryType: 'Knee Inflammation', injuryDate: '2025-08-05', recoveryStatus: 'RECOVERED', recoveryProgress: 100, expectedReturnDate: '2025-09-01', treatedBy: 'Dr. Priya Sports Medicine', notes: 'Minor inflammation, managed with anti-inflammatory medication.' },
    ];
  },

};
