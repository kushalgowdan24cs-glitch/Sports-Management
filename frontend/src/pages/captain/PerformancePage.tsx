import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp, TrendingDown, Minus, Star, Zap, AlertTriangle,
  Award, Save, ChevronDown, RefreshCw,
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { captainService } from '@/services/captain/captainService';
import { Avatar } from '@/components/common/Avatar';
import { useForm } from 'react-hook-form';
import type { PerformanceEntryForm } from '@/types/captain.types';
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
  trend === 'UP'   ? <TrendingUp   size={12} className="text-emerald-400" /> :
  trend === 'DOWN' ? <TrendingDown size={12} className="text-red-400" /> :
                     <Minus        size={12} className="text-gray-400" />;

const REMARK_OPTIONS = [
  'Excellent Performance', 'Good Teamwork', 'Needs Improvement',
  'Improve Defensive Skills', 'Good Raiding', 'Fitness Concern',
  'Outstanding Discipline', 'Work On Coordination', '',
];

const PerformancePage: React.FC = () => {
  const { data, isLoading } = useQuery({ queryKey: ['captain-performance'], queryFn: captainService.getPerformance });
  const { data: players }   = useQuery({ queryKey: ['captain-players'],    queryFn: captainService.getPlayers });
  const [activeTab, setActiveTab] = useState<'entry' | 'leaderboard' | 'chart' | 'radar'>('entry');
  const [saved, setSaved] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState('');

  const tabs = [
    { id: 'entry'       as const, label: 'Score Entry' },
    { id: 'leaderboard' as const, label: 'Leaderboard' },
    { id: 'chart'       as const, label: 'Trend Chart' },
    { id: 'radar'       as const, label: 'Radar View' },
  ];

  const { register, handleSubmit, reset } = useForm<PerformanceEntryForm>({
    defaultValues: {
      playerId: '',
      date: new Date().toISOString().split('T')[0],
      performanceScore: 75,
      improvementScore: 5,
      errorScore: 5,
      fitnessScore: 75,
      skillScore: 75,
      teamworkScore: 75,
      disciplineScore: 80,
      remarks: '',
    },
  });

  const onSubmitScores = async (formData: PerformanceEntryForm) => {
    await new Promise(r => setTimeout(r, 600));
    console.log('Scores submitted:', formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const spotlights = [
    { label: 'Top Performer',    icon: Star,          color: 'from-emerald-500 to-teal-600',  player: data?.topPerformer,    sub: (p: any) => `Score: ${p.performanceScore}` },
    { label: 'Most Improved',    icon: Zap,           color: 'from-amber-500 to-orange-600',  player: data?.mostImproved,    sub: (_p: any) => 'Highest growth' },
    { label: 'Most Consistent',  icon: Award,         color: 'from-blue-500 to-cyan-600',     player: data?.mostConsistent,  sub: (_p: any) => 'Stable performer' },
    { label: 'Needs Attention',  icon: AlertTriangle, color: 'from-red-500 to-rose-600',      player: data?.needsAttention,  sub: (p: any) => `Score: ${p.performanceScore}` },
  ];

  const topPlayer = data?.players[0];
  const radarData = topPlayer ? [
    { metric: 'Performance', value: topPlayer.performanceScore, fullMark: 100 },
    { metric: 'Fitness',     value: topPlayer.fitnessScore,     fullMark: 100 },
    { metric: 'Skill',       value: topPlayer.skillScore,       fullMark: 100 },
    { metric: 'Teamwork',    value: topPlayer.teamworkScore,    fullMark: 100 },
    { metric: 'Discipline',  value: topPlayer.disciplineScore,  fullMark: 100 },
    { metric: 'Improvement', value: topPlayer.improvementScore * 8, fullMark: 100 },
  ] : [];

  const ScoreField: React.FC<{ label: string; field: keyof PerformanceEntryForm; color: string }> = ({ label, field, color }) => (
    <div className="bg-dark-900/60 border border-dark-700/50 rounded-xl p-3">
      <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-2">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="range" min="0" max="100" step="1"
          {...register(field, { valueAsNumber: true })}
          className="flex-1 accent-emerald-500"
        />
        <input
          type="number" min="0" max="100"
          {...register(field, { valueAsNumber: true })}
          className={clsx('w-14 bg-dark-800 border border-dark-700 rounded-lg px-2 py-1 text-sm font-bold text-center focus:outline-none focus:border-emerald-500', color)}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Performance Management</h1>
        <p className="text-sm text-gray-400 mt-1">Update player scores and monitor team performance metrics</p>
      </div>

      {/* Team Average Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Overall',     value: data?.teamAverage.overallScore ?? 0,      color: 'text-emerald-400' },
          { label: 'Performance', value: data?.teamAverage.performanceScore ?? 0,  color: 'text-cyan-400' },
          { label: 'Fitness',     value: data?.teamAverage.fitnessScore ?? 0,      color: 'text-green-400' },
          { label: 'Skill',       value: data?.teamAverage.skillScore ?? 0,        color: 'text-amber-400' },
          { label: 'Teamwork',    value: data?.teamAverage.teamworkScore ?? 0,     color: 'text-blue-400' },
          { label: 'Discipline',  value: data?.teamAverage.disciplineScore ?? 0,   color: 'text-pink-400' },
        ].map(s => (
          <div key={s.label} className="bg-dark-800 border border-dark-700 rounded-2xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Team {s.label}</p>
            <p className={clsx('text-2xl font-bold', s.color)}>{isLoading ? '—' : s.value}</p>
            <div className="mt-2 h-1.5 bg-dark-700 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${s.value}%` }} />
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
                  <div className="flex items-center gap-2">
                    <Avatar name={p.name} size="sm" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                      <p className="text-[10px] text-gray-500">{s.sub(p)}</p>
                    </div>
                  </div>
                ) : <div className="h-8 bg-dark-700 rounded-lg animate-pulse" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Panel */}
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

        {/* Score Entry */}
        {activeTab === 'entry' && (
          <div className="p-5">
            {saved && (
              <div className="mb-4 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-sm text-emerald-400">
                ✓ Performance scores saved successfully!
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmitScores)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Player & Date */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Select Player</label>
                  <select
                    {...register('playerId', { required: true })}
                    value={selectedPlayerId}
                    onChange={e => setSelectedPlayerId(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white appearance-none focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">— Choose Player —</option>
                    {(players ?? []).map(p => (
                      <option key={p.id} value={p.id}>{p.name} (#{p.jerseyNumber})</option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 bottom-3 text-gray-500 pointer-events-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Date</label>
                  <input type="date" {...register('date')}
                    className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Score Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <ScoreField label="Performance Score" field="performanceScore" color="text-emerald-400" />
                <ScoreField label="Fitness Score"     field="fitnessScore"    color="text-green-400" />
                <ScoreField label="Skill Score"       field="skillScore"      color="text-amber-400" />
                <ScoreField label="Teamwork Score"    field="teamworkScore"   color="text-blue-400" />
                <ScoreField label="Discipline Score"  field="disciplineScore" color="text-pink-400" />
                <ScoreField label="Improvement Score" field="improvementScore" color="text-cyan-400" />
                <div className="bg-dark-900/60 border border-dark-700/50 rounded-xl p-3">
                  <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-2">Error Score</label>
                  <div className="flex items-center gap-3">
                    <input type="range" min="0" max="20" step="1" {...register('errorScore', { valueAsNumber: true })} className="flex-1 accent-red-500" />
                    <input type="number" min="0" max="20" {...register('errorScore', { valueAsNumber: true })}
                      className="w-14 bg-dark-800 border border-dark-700 rounded-lg px-2 py-1 text-sm font-bold text-center text-red-400 focus:outline-none focus:border-emerald-500" />
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Remarks</label>
                <div className="relative">
                  <select {...register('remarks')}
                    className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white appearance-none focus:outline-none focus:border-emerald-500">
                    {REMARK_OPTIONS.map((r, i) => <option key={i} value={r}>{r || '— No Remark —'}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => reset()}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-4 py-2.5 rounded-xl bg-dark-700 border border-dark-600 transition-colors">
                  <RefreshCw size={12} /> Reset
                </button>
                <button type="submit"
                  className="flex items-center gap-1.5 text-sm text-white px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition-colors">
                  <Save size={14} /> {saved ? '✓ Saved!' : 'Save Scores'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Leaderboard */}
        {activeTab === 'leaderboard' && (
          <div className="p-5">
            <div className="space-y-2">
              {(data?.players ?? []).map((player, idx) => (
                <div key={player.playerId}
                  className={clsx(
                    'flex items-center gap-3 p-3 rounded-xl border transition-all',
                    idx === 0 ? 'bg-emerald-500/10 border-emerald-500/30' :
                    idx === 1 ? 'bg-blue-500/5 border-blue-500/20' :
                    idx === 2 ? 'bg-cyan-500/5 border-cyan-500/20' :
                    'bg-dark-900/60 border-dark-700/50',
                  )}>
                  <div className={clsx(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                    idx === 0 ? 'bg-yellow-500 text-white' :
                    idx === 1 ? 'bg-gray-400 text-dark-900' :
                    idx === 2 ? 'bg-amber-700 text-white' : 'bg-dark-700 text-gray-400',
                  )}>#{player.rank}</div>
                  <Avatar name={player.playerName} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{player.playerName}</p>
                    <div className="flex gap-2 mt-0.5 flex-wrap">
                      {[
                        { label: 'Perf', val: player.performanceScore, color: 'text-emerald-400' },
                        { label: 'Fit',  val: player.fitnessScore,     color: 'text-green-400' },
                        { label: 'Skill',val: player.skillScore,       color: 'text-amber-400' },
                        { label: 'Team', val: player.teamworkScore,    color: 'text-blue-400' },
                      ].map(m => (
                        <span key={m.label} className={clsx('text-[10px]', m.color)}>{m.label}: {m.val}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-lg font-bold text-white">{player.overallScore}</span>
                    <TrendIcon trend={player.trend} />
                  </div>
                  {player.remarks && (
                    <span className="hidden lg:block text-[10px] px-2 py-0.5 rounded-full bg-dark-700 text-gray-400 max-w-[140px] truncate">{player.remarks}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trend Chart */}
        {activeTab === 'chart' && (
          <div className="p-5">
            <h4 className="text-sm font-semibold text-white mb-4">Monthly Team Performance Trend</h4>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data?.monthlyTrend ?? []}>
                <defs>
                  <linearGradient id="capPerfTop" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="capPerfAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[55, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
                <Area type="monotone" dataKey="topScore"    name="Top Score"  stroke="#f59e0b" strokeWidth={2} fill="url(#capPerfTop)" dot={{ fill: '#f59e0b', r: 3 }} />
                <Area type="monotone" dataKey="teamAvg"     name="Team Avg"   stroke="#10b981" strokeWidth={2} fill="url(#capPerfAvg)" dot={{ fill: '#10b981', r: 3 }} />
                <Area type="monotone" dataKey="lowestScore" name="Lowest"     stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 4" fill="none" dot={{ fill: '#ef4444', r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Radar */}
        {activeTab === 'radar' && (
          <div className="p-5">
            <h4 className="text-sm font-semibold text-white mb-4">Top Player Skill Radar — {topPlayer?.playerName ?? '—'}</h4>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1f2937" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <Radar name={topPlayer?.playerName ?? 'Top Player'} dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="mt-2 flex items-center gap-4 justify-center text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-500 rounded-full inline-block" /> {topPlayer?.playerName ?? 'Top Player'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformancePage;
