import React, { useMemo } from 'react';
import {
  Users, UserCheck, Shield, Trophy, CheckCircle, XCircle,
  TrendingUp, Calendar, Activity, Zap, Plus, ClipboardList,
  BarChart3, Swords, ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '@/components/common/StatCard';
import { AttendanceChart } from '@/components/charts/AttendanceChart';
import { PerformanceTrendChart } from '@/components/charts/PerformanceChart';
import { MatchStatsChart } from '@/components/charts/MatchStatsChart';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { ROUTES } from '@/utils/constants';
import { formatRelativeTime } from '@/utils/dateUtils';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockStats = {
  totalPlayers: 87,
  totalCaptains: 6,
  totalViceCaptains: 6,
  totalTeams: 6,
  presentToday: 71,
  absentToday: 16,
  teamAverageScore: 74.3,
  upcomingMatches: 4,
};

const mockAttendanceData = [
  { date: '10 Jun', present: 75, absent: 12, total: 87, percentage: 86 },
  { date: '11 Jun', present: 68, absent: 19, total: 87, percentage: 78 },
  { date: '12 Jun', present: 80, absent: 7,  total: 87, percentage: 92 },
  { date: '13 Jun', present: 71, absent: 16, total: 87, percentage: 82 },
  { date: '14 Jun', present: 77, absent: 10, total: 87, percentage: 89 },
  { date: '15 Jun', present: 84, absent: 3,  total: 87, percentage: 97 },
  { date: '16 Jun', present: 71, absent: 16, total: 87, percentage: 82 },
];

const mockPerformanceTrend = [
  { month: 'Jan', averageScore: 64, topScore: 88, fitnessScore: 70, teamworkScore: 72 },
  { month: 'Feb', averageScore: 67, topScore: 90, fitnessScore: 73, teamworkScore: 74 },
  { month: 'Mar', averageScore: 70, topScore: 91, fitnessScore: 75, teamworkScore: 76 },
  { month: 'Apr', averageScore: 68, topScore: 89, fitnessScore: 72, teamworkScore: 73 },
  { month: 'May', averageScore: 73, topScore: 93, fitnessScore: 78, teamworkScore: 79 },
  { month: 'Jun', averageScore: 74, topScore: 95, fitnessScore: 80, teamworkScore: 81 },
];

const mockRecentActivity = [
  { id: '1', type: 'PLAYER_ADDED',       description: 'New player Rajan Kumar added to Cricket team',  time: new Date(Date.now() - 15 * 60 * 1000).toISOString(),  icon: Users,         color: 'text-blue-400',    bg: 'bg-blue-400/10' },
  { id: '2', type: 'ATTENDANCE_MARKED',  description: 'Attendance marked for Football team — 18/20 present', time: new Date(Date.now() - 45 * 60 * 1000).toISOString(), icon: ClipboardList,  color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { id: '3', type: 'MATCH_RESULT',       description: 'Cricket vs SJCE — WIN (245/8 vs 210)',           time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), icon: Swords,         color: 'text-amber-400',   bg: 'bg-amber-400/10' },
  { id: '4', type: 'PERFORMANCE_SCORED', description: 'Performance scores updated for Kabaddi team',    time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), icon: TrendingUp,     color: 'text-violet-400',  bg: 'bg-violet-400/10' },
  { id: '5', type: 'ACHIEVEMENT',        description: 'Volleyball team won District Championship',       time: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), icon: Trophy,         color: 'text-yellow-400',  bg: 'bg-yellow-400/10' },
];

const mockUpcomingMatches = [
  { id: '1', opponent: 'SJCE',    sport: 'Cricket',    date: '18 Jun 2026', venue: 'Home Ground',  type: 'TOURNAMENT' },
  { id: '2', opponent: 'NIT-K',   sport: 'Football',   date: '20 Jun 2026', venue: 'NIT Campus',   type: 'LEAGUE' },
  { id: '3', opponent: 'PESIT',   sport: 'Kabaddi',    date: '22 Jun 2026', venue: 'Indoor Hall',  type: 'FRIENDLY' },
  { id: '4', opponent: 'RVCE',    sport: 'Volleyball', date: '25 Jun 2026', venue: 'RVCE Ground',  type: 'TOURNAMENT' },
];

const quickActions = [
  { label: 'Add Player',        icon: Users,        color: 'text-blue-400',    bg: 'bg-blue-400/10',    href: ROUTES.ADMIN.PLAYERS },
  { label: 'Mark Attendance',   icon: CheckCircle,  color: 'text-emerald-400', bg: 'bg-emerald-400/10', href: ROUTES.ADMIN.ATTENDANCE },
  { label: 'Schedule Match',    icon: Calendar,     color: 'text-amber-400',   bg: 'bg-amber-400/10',   href: ROUTES.ADMIN.MATCHES },
  { label: 'View Analytics',    icon: BarChart3,    color: 'text-cyan-400',    bg: 'bg-cyan-400/10',    href: ROUTES.ADMIN.ANALYTICS },
  { label: 'Log Injury',        icon: Activity,     color: 'text-red-400',     bg: 'bg-red-400/10',     href: ROUTES.ADMIN.INJURIES },
  { label: 'Add Achievement',   icon: Trophy,       color: 'text-yellow-400',  bg: 'bg-yellow-400/10',  href: ROUTES.ADMIN.ACHIEVEMENTS },
];

const sportTypeColors: Record<string, string> = {
  TOURNAMENT: 'text-primary-400 bg-primary-400/10',
  LEAGUE:     'text-emerald-400 bg-emerald-400/10',
  FRIENDLY:   'text-gray-400 bg-gray-400/10',
};

// ─── Component ────────────────────────────────────────────────────────────────
const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const attendanceRate = useMemo(() =>
    Math.round((mockStats.presentToday / mockStats.totalPlayers) * 100), []);

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back, Coach! 👋</h1>
          <p className="text-sm text-gray-400 mt-1">
            Here's what's happening with your teams today.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-dark-800 border border-dark-700 rounded-xl text-sm text-gray-400">
          <Calendar size={14} className="text-primary-400" />
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Players"
          value={mockStats.totalPlayers}
          icon={<Users size={20} />}
          iconBg="bg-blue-500/20"
          trend={5}
          subtitle="Across all teams"
          gradient="bg-gradient-to-br from-blue-600 to-blue-800"
          onClick={() => navigate(ROUTES.ADMIN.PLAYERS)}
        />
        <StatCard
          title="Total Captains"
          value={mockStats.totalCaptains}
          icon={<UserCheck size={20} />}
          iconBg="bg-emerald-500/20"
          subtitle={`${mockStats.totalViceCaptains} Vice Captains`}
          gradient="bg-gradient-to-br from-emerald-600 to-emerald-800"
        />
        <StatCard
          title="Total Teams"
          value={mockStats.totalTeams}
          icon={<Shield size={20} />}
          iconBg="bg-violet-500/20"
          trend={0}
          subtitle="Active sports teams"
          gradient="bg-gradient-to-br from-violet-600 to-violet-800"
        />
        <StatCard
          title="Upcoming Matches"
          value={mockStats.upcomingMatches}
          icon={<Calendar size={20} />}
          iconBg="bg-amber-500/20"
          subtitle="Next 30 days"
          gradient="bg-gradient-to-br from-amber-600 to-amber-800"
          onClick={() => navigate(ROUTES.ADMIN.MATCHES)}
        />
      </div>

      {/* Attendance Today */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Present Today"
          value={mockStats.presentToday}
          icon={<CheckCircle size={20} />}
          iconBg="bg-emerald-500/20"
          trend={8}
          subtitle={`${attendanceRate}% attendance rate`}
        />
        <StatCard
          title="Absent Today"
          value={mockStats.absentToday}
          icon={<XCircle size={20} />}
          iconBg="bg-red-500/20"
          trend={-3}
          subtitle="Players absent"
        />
        <StatCard
          title="Team Avg Score"
          value={`${mockStats.teamAverageScore}`}
          icon={<TrendingUp size={20} />}
          iconBg="bg-primary-500/20"
          trend={4}
          subtitle="Performance score"
          onClick={() => navigate(ROUTES.ADMIN.PERFORMANCE)}
        />
        <StatCard
          title="Vice Captains"
          value={mockStats.totalViceCaptains}
          icon={<Trophy size={20} />}
          iconBg="bg-yellow-500/20"
          subtitle="Leadership roles"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Attendance Chart */}
        <div className="lg:col-span-2 bg-dark-800 border border-dark-700 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Attendance Summary</h2>
              <p className="text-xs text-gray-500 mt-0.5">Last 7 days attendance trend</p>
            </div>
            <button
              onClick={() => navigate(ROUTES.ADMIN.ATTENDANCE)}
              className="text-xs text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1"
            >
              View report <ArrowRight size={12} />
            </button>
          </div>
          <AttendanceChart data={mockAttendanceData} height={240} />
        </div>

        {/* Match Stats */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Match Stats</h2>
              <p className="text-xs text-gray-500 mt-0.5">This season</p>
            </div>
            <button
              onClick={() => navigate(ROUTES.ADMIN.MATCHES)}
              className="text-xs text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1"
            >
              All matches <ArrowRight size={12} />
            </button>
          </div>
          <MatchStatsChart wins={8} losses={3} draws={2} height={180} />
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[
              { label: 'Wins',   value: 8,  color: 'text-emerald-400' },
              { label: 'Losses', value: 3,  color: 'text-red-400' },
              { label: 'Draws',  value: 2,  color: 'text-gray-400' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Trend */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-white">Monthly Performance Trend</h2>
            <p className="text-xs text-gray-500 mt-0.5">Average scores across all teams (last 6 months)</p>
          </div>
          <button
            onClick={() => navigate(ROUTES.ADMIN.ANALYTICS)}
            className="text-xs text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1"
          >
            Full analytics <ArrowRight size={12} />
          </button>
        </div>
        <PerformanceTrendChart data={mockPerformanceTrend} height={240} />
      </div>

      {/* Bottom Row: Activity, Quick Actions, Upcoming Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <div className="lg:col-span-1 bg-dark-800 border border-dark-700 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">Recent Activity</h2>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Zap size={12} className="text-amber-400" /> Live
            </span>
          </div>
          <div className="space-y-3">
            {mockRecentActivity.map(activity => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl ${activity.bg} shrink-0`}>
                    <Icon size={14} className={activity.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-300 leading-relaxed">{activity.description}</p>
                    <p className="text-[10px] text-gray-600 mt-1">{formatRelativeTime(activity.time)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
          <h2 className="text-base font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map(action => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => navigate(action.href)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border border-dark-700
                             hover:border-dark-600 hover:bg-white/5 transition-all duration-200 group"
                >
                  <div className={`p-2.5 rounded-xl ${action.bg} transition-transform group-hover:scale-110`}>
                    <Icon size={16} className={action.color} />
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-white transition-colors text-center leading-tight">
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => navigate(ROUTES.ADMIN.PLAYERS)}
            className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                       bg-primary-600/20 border border-primary-500/30 text-sm text-primary-300
                       hover:bg-primary-600/30 transition-colors"
          >
            <Plus size={14} /> Add New Player
          </button>
        </div>

        {/* Upcoming Matches */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">Upcoming Matches</h2>
            <button
              onClick={() => navigate(ROUTES.ADMIN.MATCHES)}
              className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
            >
              View all →
            </button>
          </div>
          <div className="space-y-3">
            {mockUpcomingMatches.map(match => (
              <div
                key={match.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-dark-900/60 border border-dark-700/50 hover:border-dark-600 transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600/30 to-violet-600/30 border border-primary-500/20 flex items-center justify-center">
                  <Swords size={14} className="text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">vs {match.opponent}</p>
                  <p className="text-xs text-gray-500">{match.sport} · {match.venue}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-300">{match.date}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${sportTypeColors[match.type]}`}>
                    {match.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
