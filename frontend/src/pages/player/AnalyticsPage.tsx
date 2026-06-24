import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Lightbulb, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { playerDashboardService } from '@/services/player/playerDashboardService';

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

const AnalyticsPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['player-analytics'],
    queryFn: playerDashboardService.getAnalytics,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Analytics</h1>
        <p className="text-sm text-gray-400 mt-1">Deep insights into your performance growth and trends</p>
      </div>

      {/* Insights Cards */}
      {!isLoading && data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-5">
            <TrendingUp size={16} className="text-emerald-400 mb-2" />
            <p className="text-xs text-emerald-300 uppercase tracking-wider mb-1">Most Improved Month</p>
            <p className="text-base font-bold text-white">{data.insights.mostImprovedMonth}</p>
          </div>
          <div className="bg-primary-500/10 border border-primary-500/25 rounded-2xl p-5">
            <CheckCircle size={16} className="text-primary-400 mb-2" />
            <p className="text-xs text-primary-300 uppercase tracking-wider mb-1">Strongest Skill</p>
            <p className="text-base font-bold text-white">{data.insights.strongestSkill}</p>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-5">
            <AlertCircle size={16} className="text-amber-400 mb-2" />
            <p className="text-xs text-amber-300 uppercase tracking-wider mb-1">Areas to Improve</p>
            <p className="text-sm font-medium text-white leading-relaxed">
              {data.insights.areasForImprovement.slice(0, 2).join(' · ')}
            </p>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/25 rounded-2xl p-5">
            <Lightbulb size={16} className="text-cyan-400 mb-2" />
            <p className="text-xs text-cyan-300 uppercase tracking-wider mb-1">Consistency Score</p>
            <p className="text-3xl font-bold text-white">{data.insights.performanceConsistency}<span className="text-base text-gray-400">%</span></p>
          </div>
        </div>
      )}

      {/* Performance Growth vs Team */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-white mb-1">Performance Growth</h3>
        <p className="text-xs text-gray-500 mb-4">Your monthly score compared to team average</p>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data?.performanceGrowth ?? []}>
            <defs>
              <linearGradient id="myGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="teamGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6b7280" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6b7280" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[60, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
            <Area type="monotone" dataKey="score"   name="My Score"   stroke="#6366f1" fill="url(#myGrad)"   strokeWidth={2.5} dot={{ r: 3 }} />
            <Area type="monotone" dataKey="teamAvg" name="Team Avg"   stroke="#6b7280" fill="url(#teamGrad)" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Score Comparison + Attendance Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Score Comparison */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-1">Score Comparison</h3>
          <p className="text-xs text-gray-500 mb-4">Current vs Previous vs Semester baseline</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data?.scoreComparison ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
              <Bar dataKey="current"  name="Current"  fill="#6366f1" radius={[3, 3, 0, 0]} />
              <Bar dataKey="previous" name="Previous" fill="#10b981" radius={[3, 3, 0, 0]} />
              <Bar dataKey="semester" name="Baseline" fill="#374151" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Trend */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-1">Attendance Trend</h3>
          <p className="text-xs text-gray-500 mb-4">Monthly attendance percentage over time</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data?.attendanceTrend ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[70, 105]} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="percentage" name="Attendance %" stroke="#06b6d4" strokeWidth={2.5} dot={{ fill: '#06b6d4', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Improvement Tips */}
      {data && (
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Lightbulb size={14} className="text-amber-400" /> Areas for Improvement
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {data.insights.areasForImprovement.map((area, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 text-sm font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <p className="text-sm text-gray-300">{area}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
