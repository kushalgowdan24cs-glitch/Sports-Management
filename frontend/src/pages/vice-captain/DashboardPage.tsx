import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Users, CheckSquare, XSquare, TrendingUp, Swords, Calendar,
  ChevronRight, Megaphone, ClipboardList, BarChart3, Activity,
  FileText, Star, Zap, AlertTriangle,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { vcDashboardService } from '@/services/vice-captain/vcDashboardService';
import { StatCard } from '@/components/common/StatCard';
import { ROUTES } from '@/utils/constants';

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
  const { data: stats, isLoading } = useQuery({ queryKey: ['vc-stats'],        queryFn: vcDashboardService.getStats });
  const { data: attendance }       = useQuery({ queryKey: ['vc-attendance'],    queryFn: vcDashboardService.getAttendance });
  const { data: performance }      = useQuery({ queryKey: ['vc-performance'],   queryFn: vcDashboardService.getPerformance });
  const { data: matches }          = useQuery({ queryKey: ['vc-matches'],        queryFn: vcDashboardService.getMatches });
  const { data: announcements }    = useQuery({ queryKey: ['vc-announcements'], queryFn: vcDashboardService.getAnnouncements });
  const { data: injuries }         = useQuery({ queryKey: ['vc-injuries'],      queryFn: vcDashboardService.getInjuries });

  const quickActions = [
    { label: 'View Attendance',      icon: ClipboardList, path: ROUTES.VICE_CAPTAIN.ATTENDANCE,    color: 'from-emerald-600 to-teal-600',    ring: 'ring-emerald-500/30' },
    { label: 'View Analytics',       icon: BarChart3,     path: ROUTES.VICE_CAPTAIN.ANALYTICS,     color: 'from-violet-600 to-purple-600',   ring: 'ring-violet-500/30' },
    { label: 'View Players',         icon: Users,         path: ROUTES.VICE_CAPTAIN.PLAYERS,       color: 'from-cyan-600 to-blue-600',       ring: 'ring-cyan-500/30' },
    { label: 'Create Announcement',  icon: Megaphone,     path: ROUTES.VICE_CAPTAIN.ANNOUNCEMENTS, color: 'from-amber-600 to-orange-600',    ring: 'ring-amber-500/30' },
    { label: 'Submit Team Report',   icon: FileText,      path: ROUTES.VICE_CAPTAIN.REPORTS,       color: 'from-indigo-600 to-violet-600',   ring: 'ring-indigo-500/30' },
  ];

  const upcomingMatch = matches?.find(m => m.result === 'UPCOMING');
  const activeInjuries = injuries?.filter(i => i.recoveryStatus !== 'RECOVERED') ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Vice Captain Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">Team overview — assist, monitor, and coordinate your team.</p>
        </div>
        <div className="flex items-center gap-3">
          {stats?.nextMatch && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-500/10 border border-violet-500/25">
              <Calendar size={14} className="text-violet-400" />
              <div>
                <p className="text-[10px] text-violet-400 font-medium uppercase tracking-wider">Next Match</p>
                <p className="text-xs font-semibold text-white">{stats.nextMatch}</p>
              </div>
            </div>
          )}
          {activeInjuries.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/25">
              <Activity size={14} className="text-red-400" />
              <p className="text-xs font-semibold text-red-300">{activeInjuries.length} injured</p>
            </div>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Players"    value={isLoading ? '—' : stats?.totalPlayers ?? 0}                   icon={<Users size={20} />}       iconBg="bg-violet-500/20"  gradient="bg-gradient-to-br from-violet-500 to-purple-600" />
        <StatCard title="Present Today"    value={isLoading ? '—' : stats?.presentToday ?? 0}                   icon={<CheckSquare size={20} />} iconBg="bg-emerald-500/20" gradient="bg-gradient-to-br from-emerald-500 to-teal-600" />
        <StatCard title="Absent Today"     value={isLoading ? '—' : stats?.absentToday ?? 0}                    icon={<XSquare size={20} />}     iconBg="bg-red-500/20"     gradient="bg-gradient-to-br from-red-500 to-rose-600" />
        <StatCard title="Avg Performance"  value={isLoading ? '—' : `${stats?.teamAvgPerformance ?? 0}`}        icon={<TrendingUp size={20} />}  iconBg="bg-amber-500/20"   trend={stats?.trend.performance} gradient="bg-gradient-to-br from-amber-500 to-orange-600" />
        <StatCard title="Upcoming Matches" value={isLoading ? '—' : stats?.upcomingMatches ?? 0}                icon={<Swords size={20} />}      iconBg="bg-cyan-500/20"    gradient="bg-gradient-to-br from-cyan-500 to-blue-600" />
        <StatCard title="Team Attendance"  value={isLoading ? '—' : `${stats?.teamAttendancePercentage ?? 0}%`} icon={<Star size={20} />}        iconBg="bg-pink-500/20"    trend={stats?.trend.attendance} gradient="bg-gradient-to-br from-pink-500 to-rose-600" />
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
                            bg-dark-800 hover:border-violet-500/40 hover:-translate-y-0.5 transition-all duration-200
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
            <button onClick={() => navigate(ROUTES.VICE_CAPTAIN.ATTENDANCE)} className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              View <ChevronRight size={12} />
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
            <button onClick={() => navigate(ROUTES.VICE_CAPTAIN.PERFORMANCE)} className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
              View <ChevronRight size={12} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={performance?.monthlyTrend ?? []}>
              <defs>
                <linearGradient id="vcPerfGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="teamAvg" name="Team Avg" stroke="#8b5cf6" strokeWidth={2} fill="url(#vcPerfGrad)" dot={{ fill: '#8b5cf6', r: 3 }} />
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
            <button onClick={() => navigate(ROUTES.VICE_CAPTAIN.MATCHES)} className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
              All <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-2.5">
            {(matches ?? []).filter(m => m.result === 'UPCOMING').slice(0, 3).map(m => (
              <div key={m.id} className="p-3 rounded-xl bg-dark-900/60 border border-dark-700/50">
                <p className="text-xs font-semibold text-white">vs {m.opponentTeam}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{m.matchDate} · {m.venue.split(',')[0]}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">{m.playersAvailable} available</span>
                  {m.playersInjured > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400">{m.playersInjured} injured</span>}
                </div>
              </div>
            ))}
          </div>
          {upcomingMatch && (
            <div className="mt-3 pt-3 border-t border-dark-700">
              <p className="text-[10px] text-gray-500">Next match lineup ready?</p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {(upcomingMatch.expectedLineup ?? []).slice(0, 4).map(p => (
                  <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">{p.split(' ')[0]}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent Announcements */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Megaphone size={14} className="text-yellow-400" /> Announcements
            </h3>
            <button onClick={() => navigate(ROUTES.VICE_CAPTAIN.ANNOUNCEMENTS)} className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1">
              All <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-2.5">
            {(announcements ?? []).slice(0, 4).map(a => {
              const catColors: Record<string, string> = {
                URGENT: 'bg-red-500/10 border-red-500/20 text-red-400',
                MATCH: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
                PRACTICE: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
                FITNESS: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
                GENERAL: 'bg-gray-500/10 border-gray-500/20 text-gray-400',
              };
              return (
                <div key={a.id} className="p-2.5 rounded-xl bg-dark-900/60 border border-dark-700/50">
                  <div className="flex items-start gap-2">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border shrink-0 mt-0.5 ${catColors[a.category] ?? catColors.GENERAL}`}>{a.category}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{a.title}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{new Date(a.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alerts & Injuries */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <AlertTriangle size={14} className="text-red-400" /> Team Alerts
            </h3>
          </div>
          <div className="space-y-2.5">
            {/* Low attendance */}
            {(attendance?.lowAttendancePlayers ?? []).map(p => (
              <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-red-500/5 border border-red-500/20">
                <div className="w-7 h-7 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                  <Zap size={12} className="text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">{p.name}</p>
                  <p className="text-[10px] text-red-400">{p.attendancePercentage}% attendance</p>
                </div>
              </div>
            ))}
            {/* Active injuries */}
            {activeInjuries.map(inj => (
              <div key={inj.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-orange-500/5 border border-orange-500/20">
                <div className="w-7 h-7 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0">
                  <Activity size={12} className="text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">{inj.playerName}</p>
                  <p className="text-[10px] text-orange-400">{inj.injuryType} · {inj.recoveryProgress}% recovered</p>
                </div>
              </div>
            ))}
            {activeInjuries.length === 0 && attendance?.lowAttendancePlayers.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-4">✅ No active alerts</p>
            )}
          </div>
          <button onClick={() => navigate(ROUTES.VICE_CAPTAIN.INJURIES)} className="mt-3 w-full text-xs text-center text-red-400 hover:text-red-300 flex items-center justify-center gap-1">
            View Injury Records <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
