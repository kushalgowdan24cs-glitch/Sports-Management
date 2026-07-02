import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Users, Award, ArrowUp, BarChart3 } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine,
} from 'recharts';
import { captainService } from '@/services/captain/captainService';
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

type AnalyticsTab = 'overview' | 'attendance' | 'performance' | 'rankings';

const AnalyticsPage: React.FC = () => {
  const { data, isLoading } = useQuery({ queryKey: ['captain-analytics'], queryFn: captainService.getAnalytics });
  const { data: perf }      = useQuery({ queryKey: ['captain-performance'], queryFn: captainService.getPerformance });
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('overview');

  const tabs = [
    { id: 'overview'     as const, label: 'Overview' },
    { id: 'attendance'   as const, label: 'Attendance' },
    { id: 'performance'  as const, label: 'Performance' },
    { id: 'rankings'     as const, label: 'Rankings' },
  ];

  const teamComparisonData = data?.teamComparison ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Team Analytics</h1>
        <p className="text-sm text-gray-400 mt-1">Comprehensive insights for your team's performance and attendance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Team Attendance %',  value: `${data?.attendanceTrend.slice(-1)[0]?.percentage ?? '—'}%`,  icon: <Users size={18} />,      color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
          { label: 'Team Avg Score',     value: perf?.teamAverage.overallScore ?? '—',                   icon: <TrendingUp size={18} />, color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20' },
          { label: 'Team Ranking',       value: '#2',                                                     icon: <Award size={18} />,      color: 'text-yellow-400',  bg: 'bg-yellow-500/10',  border: 'border-yellow-500/20' },
          { label: 'Monthly Growth',     value: `+${data?.monthlyGrowth.slice(-1)[0]?.growth ?? 0}%`,          icon: <ArrowUp size={18} />,    color: 'text-cyan-400',    bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20' },
        ].map(s => (
          <div key={s.label} className={clsx('bg-dark-800 border rounded-2xl p-5 flex items-center gap-4', s.border)}>
            <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', s.bg, s.color)}>
              {s.icon}
            </div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className={clsx('text-2xl font-bold mt-0.5', s.color)}>{isLoading ? '—' : s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
        <div className="flex border-b border-dark-700 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={clsx(
                'flex-1 min-w-max py-3 px-4 text-sm font-medium transition-colors whitespace-nowrap',
                activeTab === t.id ? 'bg-emerald-500/10 text-emerald-400 border-b-2 border-emerald-500' : 'text-gray-400 hover:text-white',
              )}
            >{t.label}</button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="p-5 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Attendance vs Target */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">Attendance vs Target (90%)</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={data?.attendanceTrend ?? []}>
                    <defs>
                      <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[60, 105]} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <ReferenceLine y={90} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Target', fill: '#ef4444', fontSize: 10 }} />
                    <Area type="monotone" dataKey="percentage" name="Attendance %" stroke="#10b981" strokeWidth={2} fill="url(#attGrad)" dot={{ fill: '#10b981', r: 3 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Team Comparison Radar */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">Team vs Average Comparison</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={teamComparisonData}>
                    <PolarGrid stroke="#1f2937" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                    <Radar name="Our Team" dataKey="teamScore" stroke="#10b981" fill="#10b981" fillOpacity={0.25} strokeWidth={2} />
                    <Radar name="Average"  dataKey="average"   stroke="#6b7280" fill="#6b7280" fillOpacity={0.1}  strokeWidth={1.5} />
                    <Legend wrapperStyle={{ fontSize: '10px', color: '#9ca3af' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Growth */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Monthly Performance Growth</h4>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={data?.monthlyGrowth ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="growth" name="Growth %" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Attendance Analytics */}
        {activeTab === 'attendance' && (
          <div className="p-5 space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Monthly Attendance Trend</h4>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data?.attendanceTrend ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[60, 105]} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
                  <ReferenceLine y={90} stroke="#ef4444" strokeDasharray="4 4" />
                  <Bar dataKey="percentage" name="Attendance %" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target"     name="Target %"    fill="#374151" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Best & Worst Attendance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-dark-900/60 border border-dark-700/50 rounded-xl p-4">
                <h5 className="text-xs font-semibold text-emerald-400 mb-3 flex items-center gap-1.5">
                  <BarChart3 size={12} /> Highest Attendance
                </h5>
                {(data?.rankings.bestAttendance ?? []).map(r => (
                  <div key={r.rank} className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] text-gray-500 w-6">#{r.rank}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs text-white">{r.name}</span>
                        <span className="text-xs font-bold text-emerald-400">{r.percentage}%</span>
                      </div>
                      <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${r.percentage}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-dark-900/60 border border-dark-700/50 rounded-xl p-4">
                <h5 className="text-xs font-semibold text-red-400 mb-3 flex items-center gap-1.5">
                  <BarChart3 size={12} /> Lowest Attendance
                </h5>
                {(data?.rankings.lowestAttendance ?? []).map(r => (
                  <div key={r.rank} className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] text-gray-500 w-6">#{r.rank}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs text-white">{r.name}</span>
                        <span className="text-xs font-bold text-red-400">{r.percentage}%</span>
                      </div>
                      <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: `${r.percentage}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Performance Analytics */}
        {activeTab === 'performance' && (
          <div className="p-5 space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Performance Trend</h4>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={data?.performanceTrend ?? []}>
                  <defs>
                    <linearGradient id="apTop" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="apAvg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[50, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
                  <Area type="monotone" dataKey="topPlayer"    name="Top Player"  stroke="#f59e0b" strokeWidth={2} fill="url(#apTop)" dot={{ fill: '#f59e0b', r: 3 }} />
                  <Area type="monotone" dataKey="teamAvg"      name="Team Avg"    stroke="#10b981" strokeWidth={2} fill="url(#apAvg)" dot={{ fill: '#10b981', r: 3 }} />
                  <Area type="monotone" dataKey="lowestPlayer" name="Lowest"      stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 4" fill="none" dot={{ fill: '#ef4444', r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Rankings */}
        {activeTab === 'rankings' && (
          <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Top Performers */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Award size={14} className="text-yellow-400" /> Top Performers
              </h4>
              {(data?.rankings.topPerformers ?? []).map(r => (
                <div key={r.rank} className="flex items-center gap-3 p-3 rounded-xl bg-dark-900/60 border border-dark-700/50 mb-2">
                  <div className={clsx(
                    'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold',
                    r.rank === 1 ? 'bg-yellow-500 text-white' : r.rank === 2 ? 'bg-gray-400 text-dark-900' : r.rank === 3 ? 'bg-amber-700 text-white' : 'bg-dark-700 text-gray-400',
                  )}>#{r.rank}</div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-white">{r.name}</p>
                    <div className="h-1 bg-dark-700 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${r.score}%` }} />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-emerald-400">{r.score}</span>
                </div>
              ))}
            </div>

            {/* Most Improved */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <TrendingUp size={14} className="text-cyan-400" /> Most Improved
              </h4>
              {(data?.rankings.mostImproved ?? []).map(r => (
                <div key={r.rank} className="flex items-center gap-3 p-3 rounded-xl bg-dark-900/60 border border-dark-700/50 mb-2">
                  <div className={clsx(
                    'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold',
                    r.rank === 1 ? 'bg-cyan-500 text-white' : 'bg-dark-700 text-gray-400',
                  )}>#{r.rank}</div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-white">{r.name}</p>
                    <p className="text-[10px] text-gray-500">+{r.improvement} pts improvement</p>
                  </div>
                  <span className="text-sm font-bold text-cyan-400">+{r.improvement}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
