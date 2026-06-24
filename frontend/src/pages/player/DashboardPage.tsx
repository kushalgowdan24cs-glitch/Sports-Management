import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, ClipboardList, Trophy, Zap, Swords, Star,
  Calendar, MessageSquare, Activity, ChevronRight,
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { playerDashboardService } from '@/services/player/playerDashboardService';
import { StatCard } from '@/components/common/StatCard';
import { ROUTES } from '@/utils/constants';

// Recharts custom tooltip
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 shadow-xl text-xs">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['player-stats'],
    queryFn: playerDashboardService.getStats,
  });
  const { data: performance } = useQuery({
    queryKey: ['player-performance'],
    queryFn: playerDashboardService.getPerformance,
  });
  const { data: attendance } = useQuery({
    queryKey: ['player-attendance'],
    queryFn: playerDashboardService.getAttendance,
  });
  const { data: matches } = useQuery({
    queryKey: ['player-matches'],
    queryFn: playerDashboardService.getMatches,
  });
  const { data: achievements } = useQuery({
    queryKey: ['player-achievements'],
    queryFn: playerDashboardService.getAchievements,
  });
  const { data: feedback } = useQuery({
    queryKey: ['player-feedback'],
    queryFn: playerDashboardService.getFeedback,
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">Welcome back, Athlete! Here's your performance snapshot.</p>
        </div>
        {stats?.nextMatch && (
          <div className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25">
            <Calendar size={14} className="text-amber-400" />
            <div>
              <p className="text-[10px] text-amber-400 font-medium uppercase tracking-wider">Next Match</p>
              <p className="text-xs font-semibold text-white">{stats.nextMatch}</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Performance Score"
          value={statsLoading ? '—' : `${stats?.performanceScore ?? 0}`}
          icon={<TrendingUp size={20} />}
          iconBg="bg-primary-500/20"
          trend={stats?.trend.performance}
          gradient="bg-gradient-to-br from-primary-500 to-violet-600"
          className="col-span-1"
        />
        <StatCard
          title="Attendance"
          value={statsLoading ? '—' : `${stats?.attendancePercentage ?? 0}%`}
          icon={<ClipboardList size={20} />}
          iconBg="bg-emerald-500/20"
          trend={stats?.trend.attendance}
          gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
        />
        <StatCard
          title="Team Rank"
          value={statsLoading ? '—' : `#${stats?.teamRank ?? '—'}`}
          icon={<Star size={20} />}
          iconBg="bg-amber-500/20"
          gradient="bg-gradient-to-br from-amber-500 to-orange-600"
        />
        <StatCard
          title="Improvement"
          value={statsLoading ? '—' : `+${stats?.improvementScore ?? 0}%`}
          icon={<Zap size={20} />}
          iconBg="bg-cyan-500/20"
          trend={stats?.trend.improvement}
          gradient="bg-gradient-to-br from-cyan-500 to-blue-600"
        />
        <StatCard
          title="Matches Played"
          value={statsLoading ? '—' : `${stats?.matchesPlayed ?? 0}`}
          icon={<Swords size={20} />}
          iconBg="bg-violet-500/20"
          gradient="bg-gradient-to-br from-violet-500 to-purple-600"
        />
        <StatCard
          title="Achievements"
          value={statsLoading ? '—' : `${stats?.achievementsEarned ?? 0}`}
          icon={<Trophy size={20} />}
          iconBg="bg-yellow-500/20"
          gradient="bg-gradient-to-br from-yellow-500 to-amber-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Performance Trend */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Performance Trend</h3>
              <p className="text-xs text-gray-500">Monthly overall score</p>
            </div>
            <button
              onClick={() => navigate(ROUTES.PLAYER.PERFORMANCE)}
              className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1"
            >
              View All <ChevronRight size={12} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={performance?.monthlyProgress ?? []}>
              <defs>
                <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="overall" name="Score" stroke="#6366f1" strokeWidth={2} fill="url(#perfGrad)" dot={{ fill: '#6366f1', r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Overview */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Attendance Overview</h3>
              <p className="text-xs text-gray-500">Monthly present / absent sessions</p>
            </div>
            <button
              onClick={() => navigate(ROUTES.PLAYER.ATTENDANCE)}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              View All <ChevronRight size={12} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={attendance?.monthlyStats ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="present" name="Present" fill="#10b981" radius={[3, 3, 0, 0]} />
              <Bar dataKey="absent" name="Absent" fill="#ef4444" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row: Recent Matches + Feedback + Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Matches */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Swords size={14} className="text-amber-400" /> Recent Matches
            </h3>
            <button onClick={() => navigate(ROUTES.PLAYER.MATCHES)} className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
              All <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-2.5">
            {(matches ?? []).slice(0, 4).map(m => (
              <div key={m.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-dark-900/60 border border-dark-700/50">
                <div className={`w-1.5 h-10 rounded-full shrink-0 ${m.result === 'WIN' ? 'bg-emerald-500' : m.result === 'LOSS' ? 'bg-red-500' : 'bg-gray-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">vs {m.opponentName}</p>
                  <p className="text-[11px] text-gray-500">{m.matchDate}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-white">{m.teamScore}–{m.opponentScore}</p>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                    m.result === 'WIN' ? 'bg-emerald-500/20 text-emerald-400' :
                    m.result === 'LOSS' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>{m.result}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <MessageSquare size={14} className="text-pink-400" /> Coach Feedback
            </h3>
            <button onClick={() => navigate(ROUTES.PLAYER.FEEDBACK)} className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1">
              All <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {(feedback ?? []).slice(0, 3).map(f => (
              <div key={f.id} className={`p-3 rounded-xl border ${
                f.category === 'PRAISE' ? 'bg-emerald-500/5 border-emerald-500/20' :
                f.category === 'IMPROVEMENT' ? 'bg-amber-500/5 border-amber-500/20' :
                'bg-dark-900/60 border-dark-700/50'
              }`}>
                <p className="text-xs font-semibold text-white mb-1">{f.title}</p>
                <p className="text-[11px] text-gray-400 line-clamp-2">{f.remarks}</p>
                <p className="text-[10px] text-gray-600 mt-1.5">{f.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Trophy size={14} className="text-yellow-400" /> Achievements
            </h3>
            <button onClick={() => navigate(ROUTES.PLAYER.ACHIEVEMENTS)} className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1">
              All <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-2.5">
            {(achievements ?? []).slice(0, 4).map(a => {
              const emoji = a.medalType === 'GOLD' ? '🥇' : a.medalType === 'SILVER' ? '🥈' : a.medalType === 'BRONZE' ? '🥉' : '📜';
              return (
                <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-dark-900/60 border border-dark-700/50">
                  <span className="text-xl shrink-0">{emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{a.title}</p>
                    <p className="text-[11px] text-gray-500 truncate">{a.eventName}</p>
                  </div>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0 ${
                    a.level === 'NATIONAL' ? 'bg-primary-500/20 text-primary-400' :
                    a.level === 'STATE' ? 'bg-emerald-500/20 text-emerald-400' :
                    a.level === 'DISTRICT' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>{a.level}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
