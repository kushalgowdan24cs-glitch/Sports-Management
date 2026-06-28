import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp, TrendingDown, Minus, Star, Zap, AlertTriangle, Activity, Award,
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { vcDashboardService } from '@/services/vice-captain/vcDashboardService';
import { Avatar } from '@/components/common/Avatar';
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

const TrendIcon: React.FC<{ trend: string }> = ({ trend }) =>
  trend === 'UP'     ? <TrendingUp   size={12} className="text-emerald-400" /> :
  trend === 'DOWN'   ? <TrendingDown size={12} className="text-red-400" /> :
                       <Minus        size={12} className="text-gray-400" />;

const PerformancePage: React.FC = () => {
  const { data, isLoading } = useQuery({ queryKey: ['vc-performance'], queryFn: vcDashboardService.getPerformance });
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'chart' | 'radar'>('leaderboard');

  const tabs = [
    { id: 'leaderboard' as const, label: 'Leaderboard' },
    { id: 'chart'       as const, label: 'Trend Chart' },
    { id: 'radar'       as const, label: 'Radar View' },
  ];

  const spotlights = [
    { label: 'Top Performer',    icon: Star,          color: 'from-violet-500 to-purple-600', player: data?.topPerformer,  sub: (p: any) => `Score: ${p.performanceScore}` },
    { label: 'Most Improved',    icon: Zap,           color: 'from-emerald-500 to-teal-600',  player: data?.mostImproved,  sub: (_p: any) => 'Highest growth' },
    { label: 'Needs Attention',  icon: AlertTriangle, color: 'from-red-500 to-rose-600',       player: data?.needsAttention,sub: (p: any) => `Score: ${p.performanceScore}` },
    { label: 'Best Attendance',  icon: Award,         color: 'from-amber-500 to-orange-600',  player: data?.bestAttendance,sub: (p: any) => `${p.attendancePercentage}%` },
  ];

  // For radar: show top player metrics
  const topPlayer = data?.players[0];
  const radarData = topPlayer ? [
    { metric: 'Performance', value: topPlayer.performanceScore, fullMark: 100 },
    { metric: 'Fitness',     value: topPlayer.fitnessScore,     fullMark: 100 },
    { metric: 'Skill',       value: topPlayer.skillScore,       fullMark: 100 },
    { metric: 'Teamwork',    value: topPlayer.teamworkScore,     fullMark: 100 },
    { metric: 'Discipline',  value: topPlayer.disciplineScore,  fullMark: 100 },
    { metric: 'Improvement', value: topPlayer.improvementScore * 5, fullMark: 100 },
  ] : [];

  const teamRadarData = [
    { metric: 'Performance', value: data?.teamAverage.overallScore ?? 0,    fullMark: 100 },
    { metric: 'Fitness',     value: data?.teamAverage.fitnessScore ?? 0,    fullMark: 100 },
    { metric: 'Skill',       value: data?.teamAverage.skillScore ?? 0,      fullMark: 100 },
    { metric: 'Teamwork',    value: data?.teamAverage.teamworkScore ?? 0,   fullMark: 100 },
    { metric: 'Discipline',  value: data?.teamAverage.disciplineScore ?? 0, fullMark: 100 },
    { metric: 'Improvement', value: 60,                                      fullMark: 100 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Team Performance</h1>
        <p className="text-sm text-gray-400 mt-1">Monitor individual and team performance metrics</p>
      </div>

      {/* Team Average Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: 'Overall',    value: data?.teamAverage.overallScore ?? 0,    color: 'text-violet-400' },
          { label: 'Fitness',    value: data?.teamAverage.fitnessScore ?? 0,    color: 'text-emerald-400' },
          { label: 'Skill',      value: data?.teamAverage.skillScore ?? 0,      color: 'text-cyan-400' },
          { label: 'Teamwork',   value: data?.teamAverage.teamworkScore ?? 0,   color: 'text-amber-400' },
          { label: 'Discipline', value: data?.teamAverage.disciplineScore ?? 0, color: 'text-pink-400' },
        ].map(s => (
          <div key={s.label} className="bg-dark-800 border border-dark-700 rounded-2xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Team {s.label}</p>
            <p className={clsx('text-2xl font-bold', s.color)}>{isLoading ? '—' : s.value}</p>
            <div className="mt-2 h-1.5 bg-dark-700 rounded-full overflow-hidden">
              <div className={`h-full rounded-full bg-gradient-to-r ${s.color.replace('text-', 'from-').replace('-400', '-500')} to-${s.color.replace('text-', '').replace('-400', '-600')}`}
                style={{ width: `${s.value}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Spotlight Cards */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Player Spotlights</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {spotlights.map(s => {
            const Icon = s.icon;
            const p = s.player;
            return (
              <div key={s.label} className="bg-dark-800 border border-dark-700 rounded-2xl p-5 relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-5 rounded-2xl`} />
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-lg`}>
                  <Icon size={14} className="text-white" />
                </div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">{s.label}</p>
                {p ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Avatar name={p.name} size="sm" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                        <p className="text-[10px] text-gray-500">{s.sub(p)}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-8 bg-dark-700 rounded-lg animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Panel */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
        <div className="flex border-b border-dark-700">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={clsx(
                'flex-1 py-3 text-sm font-medium transition-colors',
                activeTab === t.id ? 'bg-violet-500/10 text-violet-400 border-b-2 border-violet-500' : 'text-gray-400 hover:text-white',
              )}
            >{t.label}</button>
          ))}
        </div>

        {/* Leaderboard */}
        {activeTab === 'leaderboard' && (
          <div className="p-5">
            <div className="space-y-2">
              {(data?.players ?? []).map((player, idx) => (
                <div key={player.playerId}
                  className={clsx(
                    'flex items-center gap-3 p-3 rounded-xl border transition-all',
                    idx === 0 ? 'bg-violet-500/10 border-violet-500/30' :
                    idx === 1 ? 'bg-blue-500/5 border-blue-500/20' :
                    idx === 2 ? 'bg-cyan-500/5 border-cyan-500/20' :
                    'bg-dark-900/60 border-dark-700/50',
                  )}>
                  <div className={clsx(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                    idx === 0 ? 'bg-violet-500 text-white' :
                    idx === 1 ? 'bg-blue-500 text-white' :
                    idx === 2 ? 'bg-cyan-600 text-white' : 'bg-dark-700 text-gray-400',
                  )}>#{player.rank}</div>
                  <Avatar name={player.playerName} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{player.playerName}</p>
                    <div className="flex gap-2 mt-0.5 flex-wrap">
                      {[
                        { label: 'Perf', val: player.performanceScore, color: 'text-violet-400' },
                        { label: 'Fit',  val: player.fitnessScore,     color: 'text-emerald-400' },
                        { label: 'Skill',val: player.skillScore,       color: 'text-cyan-400' },
                      ].map(m => (
                        <span key={m.label} className={clsx('text-[10px]', m.color)}>{m.label}: {m.val}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-lg font-bold text-white">{player.overallScore}</span>
                    <TrendIcon trend={player.trend} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trend Chart */}
        {activeTab === 'chart' && (
          <div className="p-5">
            <h4 className="text-sm font-semibold text-white mb-4">Monthly Team Performance Trend</h4>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={data?.monthlyTrend ?? []}>
                <defs>
                  <linearGradient id="perfTop"  x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="perfAvg"  x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[55, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="topScore"  name="Top Score"  stroke="#f59e0b" strokeWidth={2} fill="url(#perfTop)" dot={{ fill: '#f59e0b', r: 3 }} />
                <Area type="monotone" dataKey="teamAvg"   name="Team Avg"   stroke="#8b5cf6" strokeWidth={2} fill="url(#perfAvg)" dot={{ fill: '#8b5cf6', r: 3 }} />
                <Area type="monotone" dataKey="lowestScore" name="Lowest"  stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 4" fill="none" dot={{ fill: '#ef4444', r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Radar */}
        {activeTab === 'radar' && (
          <div className="p-5">
            <h4 className="text-sm font-semibold text-white mb-4">Top Player vs Team Average</h4>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1f2937" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <Radar name={topPlayer?.playerName ?? 'Top Player'} dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="mt-2 flex items-center gap-4 justify-center text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-violet-500 rounded-full inline-block" /> {topPlayer?.playerName ?? 'Top Player'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformancePage;
