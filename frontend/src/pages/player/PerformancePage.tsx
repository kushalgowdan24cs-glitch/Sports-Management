import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp, TrendingDown, Minus, Zap, Star,
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import clsx from 'clsx';
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

interface ScoreBarProps { label: string; value: number; color: string; max?: number; }
const ScoreBar: React.FC<ScoreBarProps> = ({ label, value, color, max = 100 }) => (
  <div>
    <div className="flex justify-between text-xs mb-1">
      <span className="text-gray-400">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
    <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
      <div className={clsx('h-full rounded-full transition-all duration-700', color)} style={{ width: `${(value / max) * 100}%` }} />
    </div>
  </div>
);

const PerformancePage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['player-performance'],
    queryFn: playerDashboardService.getPerformance,
  });
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly'>('monthly');

  const radarData = data ? [
    { metric: 'Performance', value: data.current.performanceScore, fullMark: 100 },
    { metric: 'Fitness',     value: data.current.fitnessScore,     fullMark: 100 },
    { metric: 'Skill',       value: data.current.skillScore,       fullMark: 100 },
    { metric: 'Teamwork',    value: data.current.teamworkScore,    fullMark: 100 },
    { metric: 'Discipline',  value: data.current.disciplineScore,  fullMark: 100 },
    { metric: 'Improvement', value: data.current.improvementScore, fullMark: 50 },
  ] : [];

  const trend = data?.current.trend;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Performance</h1>
          <p className="text-sm text-gray-400 mt-1">Detailed breakdown of your athletic performance</p>
        </div>
        <div className={clsx(
          'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold',
          trend === 'UP' ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' :
          trend === 'DOWN' ? 'bg-red-500/10 border-red-500/25 text-red-400' :
          'bg-gray-500/10 border-gray-500/25 text-gray-400',
        )}>
          {trend === 'UP' ? <TrendingUp size={16} /> : trend === 'DOWN' ? <TrendingDown size={16} /> : <Minus size={16} />}
          {trend === 'UP' ? 'Improving' : trend === 'DOWN' ? 'Declining' : 'Stable'}
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Overall Score', value: data?.current.overallScore ?? 0, icon: <Star size={16} />, color: 'text-primary-400', bg: 'bg-primary-500/15' },
          { label: 'Fitness Score', value: data?.current.fitnessScore ?? 0, icon: <Zap size={16} />, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
          { label: 'Team Rank', value: `#${data?.current.rank ?? '—'}`, icon: <TrendingUp size={16} />, color: 'text-amber-400', bg: 'bg-amber-500/15' },
          { label: 'Error Score', value: data?.current.errorScore ?? 0, icon: <Minus size={16} />, color: 'text-red-400', bg: 'bg-red-500/15' },
        ].map(s => (
          <div key={s.label} className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
            <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center mb-3', s.bg, s.color)}>
              {s.icon}
            </div>
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className="text-3xl font-bold text-white">{isLoading ? '—' : s.value}</p>
          </div>
        ))}
      </div>

      {/* Radar + Score Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Radar Chart */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-4">Skills Radar</h3>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <PolarGrid stroke="#1f2937" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#4b5563', fontSize: 9 }} />
              <Radar name="You" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Score Breakdown */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-white mb-5">Score Breakdown</h3>
          <div className="space-y-4">
            {data && [
              { label: 'Performance Score', value: data.current.performanceScore, color: 'bg-primary-500' },
              { label: 'Fitness Score',     value: data.current.fitnessScore,     color: 'bg-emerald-500' },
              { label: 'Skill Score',       value: data.current.skillScore,       color: 'bg-cyan-500' },
              { label: 'Teamwork Score',    value: data.current.teamworkScore,    color: 'bg-violet-500' },
              { label: 'Discipline Score',  value: data.current.disciplineScore,  color: 'bg-amber-500' },
              { label: 'Improvement Score', value: data.current.improvementScore, color: 'bg-pink-500', max: 50 },
            ].map(item => (
              <ScoreBar key={item.label} {...item} />
            ))}
          </div>

          {/* vs Team Average */}
          {data && (
            <div className="mt-5 pt-4 border-t border-dark-700">
              <p className="text-xs text-gray-500 mb-2">vs Team Average</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 text-center p-2 rounded-xl bg-primary-500/10 border border-primary-500/20">
                  <p className="text-lg font-bold text-primary-300">{data.current.overallScore}</p>
                  <p className="text-[10px] text-gray-500">You</p>
                </div>
                <span className="text-gray-600 text-xs">vs</span>
                <div className="flex-1 text-center p-2 rounded-xl bg-dark-700/50">
                  <p className="text-lg font-bold text-gray-400">{data.teamAverage.overallScore}</p>
                  <p className="text-[10px] text-gray-500">Team Avg</p>
                </div>
                <div className={clsx(
                  'flex-1 text-center p-2 rounded-xl border',
                  data.current.overallScore >= data.teamAverage.overallScore
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/10 border-red-500/20 text-red-400',
                )}>
                  <p className="text-lg font-bold">
                    {data.current.overallScore >= data.teamAverage.overallScore ? '+' : ''}
                    {data.current.overallScore - data.teamAverage.overallScore}
                  </p>
                  <p className="text-[10px] text-gray-500">Diff</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Charts */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Progress Over Time</h3>
          <div className="flex rounded-lg overflow-hidden border border-dark-700">
            {(['weekly', 'monthly'] as const).map(r => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={clsx(
                  'px-3 py-1.5 text-xs font-medium transition-colors capitalize',
                  timeRange === r ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white',
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          {timeRange === 'monthly' ? (
            <LineChart data={data?.monthlyProgress ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
              <Line type="monotone" dataKey="overall"    name="Overall"    stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="fitness"    name="Fitness"    stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="teamwork"   name="Teamwork"   stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="discipline" name="Discipline" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          ) : (
            <BarChart data={data?.weeklyProgress ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
              <Bar dataKey="score"    name="Score"    fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="fitness"  name="Fitness"  fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="teamwork" name="Teamwork" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformancePage;
