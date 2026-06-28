import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trophy, TrendingUp, CheckSquare } from 'lucide-react';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine,
} from 'recharts';
import { vcDashboardService } from '@/services/vice-captain/vcDashboardService';
import clsx from 'clsx';

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 shadow-xl text-xs">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">{p.name}: {p.value}{typeof p.value === 'number' && p.name.includes('%') ? '' : ''}</p>
      ))}
    </div>
  );
};

type RankTab = 'performance' | 'improved' | 'attendance';

const AnalyticsPage: React.FC = () => {
  const { data, isLoading } = useQuery({ queryKey: ['vc-analytics'], queryFn: vcDashboardService.getAnalytics });
  const [rankTab, setRankTab] = useState<RankTab>('performance');

  const rankTabs: { id: RankTab; label: string; icon: React.ElementType }[] = [
    { id: 'performance', label: 'Top Performers', icon: Trophy },
    { id: 'improved',    label: 'Most Improved',  icon: TrendingUp },
    { id: 'attendance',  label: 'Best Attendance', icon: CheckSquare },
  ];

  const rankData = {
    performance: data?.rankings.topPerformers ?? [],
    improved:    data?.rankings.mostImproved ?? [],
    attendance:  data?.rankings.bestAttendance ?? [],
  };

  const currentRank = rankData[rankTab];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Team Analytics</h1>
        <p className="text-sm text-gray-400 mt-1">Read-only team analytics — performance and attendance insights</p>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Attendance Trend */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-white">Attendance Trend</h3>
            <p className="text-xs text-gray-500">Monthly % vs 90% target</p>
          </div>
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
              <YAxis domain={[70, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine y={90} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Target 90%', fill: '#f59e0b', fontSize: 10, position: 'insideTopRight' }} />
              <Area type="monotone" dataKey="percentage" name="Attendance %" stroke="#10b981" strokeWidth={2} fill="url(#attGrad)" dot={{ fill: '#10b981', r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Trend */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-white">Performance Growth</h3>
            <p className="text-xs text-gray-500">Team average vs top player score</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data?.performanceTrend ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[65, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
              <Line type="monotone" dataKey="teamAvg"   name="Team Avg"   stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: '#8b5cf6', r: 4 }} />
              <Line type="monotone" dataKey="topPlayer" name="Top Player" stroke="#f59e0b" strokeWidth={2}   dot={{ fill: '#f59e0b', r: 3 }} strokeDasharray="5 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Growth */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-white">Monthly Team Growth</h3>
          <p className="text-xs text-gray-500">Average score improvement per month (%)</p>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data?.monthlyGrowth ?? []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="growth" name="Growth %" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Rankings */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
        <div className="flex border-b border-dark-700">
          {rankTabs.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setRankTab(t.id)}
                className={clsx(
                  'flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors',
                  rankTab === t.id ? 'bg-violet-500/10 text-violet-400 border-b-2 border-violet-500' : 'text-gray-400 hover:text-white',
                )}>
                <Icon size={13} />{t.label}
              </button>
            );
          })}
        </div>
        <div className="p-5">
          <div className="space-y-2.5">
            {currentRank.map((entry: any, idx: number) => (
              <div key={entry.rank} className={clsx(
                'flex items-center gap-4 p-3 rounded-xl border',
                idx === 0 ? 'bg-yellow-500/10 border-yellow-500/25' :
                idx === 1 ? 'bg-gray-400/10 border-gray-400/20' :
                idx === 2 ? 'bg-amber-700/10 border-amber-700/20' :
                'bg-dark-900/60 border-dark-700/50',
              )}>
                <div className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0',
                  idx === 0 ? 'bg-yellow-500 text-dark-900' :
                  idx === 1 ? 'bg-gray-400 text-dark-900' :
                  idx === 2 ? 'bg-amber-700 text-white' :
                  'bg-dark-700 text-gray-400',
                )}>
                  {idx < 3 ? ['🥇','🥈','🥉'][idx] : `#${entry.rank}`}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{entry.name}</p>
                  <p className="text-xs text-gray-500">{entry.sport}</p>
                </div>
                <div className="text-right shrink-0">
                  {rankTab === 'performance' && <p className="text-sm font-bold text-violet-400">{entry.score}</p>}
                  {rankTab === 'improved'    && <p className="text-sm font-bold text-emerald-400">+{entry.improvement}</p>}
                  {rankTab === 'attendance'  && <p className="text-sm font-bold text-cyan-400">{entry.percentage}%</p>}
                  <p className="text-[10px] text-gray-600">
                    {rankTab === 'performance' ? 'score' : rankTab === 'improved' ? 'pts growth' : 'attendance'}
                  </p>
                </div>
              </div>
            ))}
            {currentRank.length === 0 && isLoading && (
              Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 bg-dark-700 rounded-xl animate-pulse" />)
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-600 text-center">📊 Read-only analytics · Data refreshes every session</p>
    </div>
  );
};

export default AnalyticsPage;
