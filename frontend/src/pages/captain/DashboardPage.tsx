import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Users, CheckSquare, XSquare, TrendingUp, Swords, Calendar,
  ChevronRight, Megaphone, ClipboardList, BarChart3, MessageSquare,
  Trophy, Zap, Clock, Star,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { captainService } from '@/services/captain/captainService';
import { StatCard } from '@/components/common/StatCard';
import { Avatar } from '@/components/common/Avatar';
import { ROUTES } from '@/utils/constants';
import clsx from 'clsx';

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 shadow-xl text-xs">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading } = useQuery({ queryKey: ['captain-stats'],       queryFn: captainService.getStats });
  const { data: attendance }       = useQuery({ queryKey: ['captain-attendance'],   queryFn: captainService.getAttendance });
  const { data: performance }      = useQuery({ queryKey: ['captain-performance'],  queryFn: captainService.getPerformance });
  const { data: matches }          = useQuery({ queryKey: ['captain-matches'],      queryFn: captainService.getMatches });
  const { data: announcements }    = useQuery({ queryKey: ['captain-announcements'],queryFn: captainService.getAnnouncements });
  const { data: feedback }         = useQuery({ queryKey: ['captain-feedback'],     queryFn: captainService.getFeedback });

  const quickActions = [
    { label: 'Mark Attendance',     icon: ClipboardList, path: ROUTES.CAPTAIN.ATTENDANCE,    color: 'from-emerald-600 to-teal-600',    ring: 'ring-emerald-500/30' },
    { label: 'Update Scores',       icon: TrendingUp,    path: ROUTES.CAPTAIN.PERFORMANCE,   color: 'from-amber-600 to-orange-600',    ring: 'ring-amber-500/30' },
    { label: 'View Analytics',      icon: BarChart3,     path: ROUTES.CAPTAIN.ANALYTICS,     color: 'from-violet-600 to-purple-600',   ring: 'ring-violet-500/30' },
    { label: 'Announcements',       icon: Megaphone,     path: ROUTES.CAPTAIN.ANNOUNCEMENTS, color: 'from-yellow-600 to-amber-600',    ring: 'ring-yellow-500/30' },
    { label: 'Player Feedback',     icon: MessageSquare, path: ROUTES.CAPTAIN.FEEDBACK,      color: 'from-pink-600 to-rose-600',       ring: 'ring-pink-500/30' },
  ];

  const upcomingMatches = (matches ?? []).filter(m => m.result === 'UPCOMING').slice(0, 3);
  const topPlayers = (performance?.players ?? []).slice(0, 4);
  const recentFeedback = (feedback ?? []).slice(0, 3);

  const matchResultColors: Record<string, string> = {
    WIN:  'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    LOSS: 'text-red-400 bg-red-500/10 border-red-500/20',
    DRAW: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
    UPCOMING: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  };

  const catColors: Record<string, string> = {
    URGENT:  'bg-red-500/10 border-red-500/20 text-red-400',
    MATCH:   'bg-amber-500/10 border-amber-500/20 text-amber-400',
    PRACTICE:'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    FITNESS: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
    GENERAL: 'bg-gray-500/10 border-gray-500/20 text-gray-400',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Captain Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">
            {stats?.teamName ?? 'Your Team'} — Lead, manage, and inspire your players.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {stats?.nextMatch && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
              <Calendar size={14} className="text-emerald-400" />
              <div>
                <p className="text-[10px] text-emerald-400 font-medium uppercase tracking-wider">Next Match</p>
                <p className="text-xs font-semibold text-white">{stats.nextMatch}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-dark-800 border border-dark-700">
            <Clock size={14} className="text-gray-400" />
            <p className="text-xs text-gray-400">
              {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
            </p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Players"    value={isLoading ? '—' : stats?.totalPlayers ?? 0}                   icon={<Users size={20} />}       iconBg="bg-emerald-500/20"  gradient="bg-gradient-to-br from-emerald-500 to-teal-600" />
        <StatCard title="Present Today"    value={isLoading ? '—' : stats?.presentToday ?? 0}                   icon={<CheckSquare size={20} />} iconBg="bg-green-500/20"    gradient="bg-gradient-to-br from-green-500 to-emerald-600" />
        <StatCard title="Absent Today"     value={isLoading ? '—' : stats?.absentToday ?? 0}                    icon={<XSquare size={20} />}     iconBg="bg-red-500/20"      gradient="bg-gradient-to-br from-red-500 to-rose-600" />
        <StatCard title="Avg Performance"  value={isLoading ? '—' : `${stats?.teamAvgPerformance ?? 0}`}        icon={<TrendingUp size={20} />}  iconBg="bg-amber-500/20"    trend={stats?.trend.performance} gradient="bg-gradient-to-br from-amber-500 to-orange-600" />
        <StatCard title="Upcoming Matches" value={isLoading ? '—' : stats?.upcomingMatches ?? 0}                icon={<Swords size={20} />}      iconBg="bg-cyan-500/20"     gradient="bg-gradient-to-br from-cyan-500 to-blue-600" />
        <StatCard title="Team Ranking"     value={isLoading ? '—' : `#${stats?.teamRanking ?? '—'}`}            icon={<Trophy size={20} />}      iconBg="bg-yellow-500/20"   gradient="bg-gradient-to-br from-yellow-500 to-amber-600" />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {quickActions.map(a => {
            const Icon = a.icon;
            return (
              <button
                key={a.path}
                onClick={() => navigate(a.path)}
                className={`group flex flex-col items-center gap-2.5 p-4 rounded-2xl border border-dark-700
                            bg-dark-800 hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all duration-200
                            ring-0 hover:ring-2 ${a.ring}`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon size={18} className="text-white" />
                </div>
                <span className="text-xs font-medium text-gray-300 text-center leading-tight">{a.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Attendance Trend */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Team Attendance Trend</h3>
              <p className="text-xs text-gray-500">Monthly sessions — present vs absent</p>
            </div>
            <button onClick={() => navigate(ROUTES.CAPTAIN.ATTENDANCE)} className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              Mark <ChevronRight size={12} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={attendance?.monthlyTrend ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
              <Bar dataKey="present" name="Present" fill="#10b981" radius={[3, 3, 0, 0]} />
              <Bar dataKey="absent"  name="Absent"  fill="#ef4444" radius={[3, 3, 0, 0]} />
              <Bar dataKey="late"    name="Late"    fill="#f59e0b" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Trend */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Team Performance Trend</h3>
              <p className="text-xs text-gray-500">Monthly team average score</p>
            </div>
            <button onClick={() => navigate(ROUTES.CAPTAIN.PERFORMANCE)} className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
              Update <ChevronRight size={12} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={performance?.monthlyTrend ?? []}>
              <defs>
                <linearGradient id="capPerfGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[55, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="teamAvg"  name="Team Avg"  stroke="#10b981" strokeWidth={2} fill="url(#capPerfGrad)" dot={{ fill: '#10b981', r: 3 }} />
              <Area type="monotone" dataKey="topScore" name="Top Score" stroke="#f59e0b" strokeWidth={2} fill="none" dot={{ fill: '#f59e0b', r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Upcoming Matches */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Swords size={14} className="text-amber-400" /> Upcoming Matches
            </h3>
            <button onClick={() => navigate(ROUTES.CAPTAIN.MATCHES)} className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
              All <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-2.5">
            {upcomingMatches.map(m => (
              <div key={m.id} className="p-3 rounded-xl bg-dark-900/60 border border-dark-700/50">
                <p className="text-xs font-semibold text-white">vs {m.opponentTeam}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{m.matchDate} · {m.venue.split(',')[0]}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">{m.playersAvailable} available</span>
                  <span className={clsx('text-[10px] px-1.5 py-0.5 rounded-full border', matchResultColors['UPCOMING'])}>UPCOMING</span>
                </div>
              </div>
            ))}
            {upcomingMatches.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-4">No upcoming matches</p>
            )}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Star size={14} className="text-yellow-400" /> Top Performers
            </h3>
            <button onClick={() => navigate(ROUTES.CAPTAIN.PERFORMANCE)} className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1">
              All <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-2.5">
            {topPlayers.map((p, idx) => (
              <div key={p.playerId} className={clsx(
                'flex items-center gap-3 p-2.5 rounded-xl border transition-colors',
                idx === 0 ? 'bg-yellow-500/5 border-yellow-500/20' :
                idx === 1 ? 'bg-gray-500/5 border-gray-500/20' :
                idx === 2 ? 'bg-amber-500/5 border-amber-500/20' :
                'bg-dark-900/60 border-dark-700/50',
              )}>
                <div className={clsx(
                  'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0',
                  idx === 0 ? 'bg-yellow-500 text-white' :
                  idx === 1 ? 'bg-gray-400 text-dark-900' :
                  idx === 2 ? 'bg-amber-700 text-white' : 'bg-dark-700 text-gray-400',
                )}>#{p.rank}</div>
                <Avatar name={p.playerName} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{p.playerName}</p>
                  <div className="flex gap-2">
                    <span className="text-[10px] text-emerald-400">Fit: {p.fitnessScore}</span>
                    <span className="text-[10px] text-cyan-400">Skill: {p.skillScore}</span>
                  </div>
                </div>
                <span className="text-base font-bold text-white shrink-0">{p.overallScore}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Megaphone size={14} className="text-yellow-400" /> Recent Activity
            </h3>
            <button onClick={() => navigate(ROUTES.CAPTAIN.ANNOUNCEMENTS)} className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1">
              All <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-2.5">
            {(announcements ?? []).slice(0, 3).map(a => (
              <div key={a.id} className="p-2.5 rounded-xl bg-dark-900/60 border border-dark-700/50">
                <div className="flex items-start gap-2">
                  <span className={clsx('text-[9px] font-bold px-1.5 py-0.5 rounded-full border shrink-0 mt-0.5', catColors[a.category] ?? catColors.GENERAL)}>
                    {a.category}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{a.title}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{new Date(a.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Recent Feedback Preview */}
            <div className="pt-2 border-t border-dark-700">
              <p className="text-[10px] text-gray-500 mb-2 flex items-center gap-1">
                <Zap size={10} className="text-violet-400" /> Recent Feedback
              </p>
              {recentFeedback.map(f => (
                <div key={f.id} className="flex items-center gap-2 mb-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                  <p className="text-[10px] text-gray-400 truncate">{f.playerName}: <span className="text-gray-300">{f.feedbackTitle}</span></p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
