import React, { useState } from 'react';
import { TrendingUp, Award, Star, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { PerformanceRadarChart, PerformanceTrendChart } from '@/components/charts/PerformanceChart';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { Select } from '@/components/common/Select';
import { formatScore, getScoreBg } from '@/utils/formatUtils';
import clsx from 'clsx';

const MOCK_PLAYERS = [
  { id: '1', name: 'Arjun Sharma',  sport: 'Cricket',    team: 'Cricket A',    role: 'Batsman',   overallScore: 88.5, performance: 90, improvement: 85, fitness: 92, discipline: 87, teamwork: 86, skill: 88, trend: 'UP'     as const },
  { id: '2', name: 'Kiran Patel',   sport: 'Football',   team: 'Football B',   role: 'Goalkeeper',overallScore: 85.2, performance: 87, improvement: 80, fitness: 90, discipline: 88, teamwork: 84, skill: 82, trend: 'UP'     as const },
  { id: '3', name: 'Amit Joshi',    sport: 'Volleyball', team: 'Volleyball A', role: 'All-Rounder',overallScore: 82.0, performance: 83, improvement: 78, fitness: 85, discipline: 83, teamwork: 88, skill: 80, trend: 'STABLE' as const },
  { id: '4', name: 'Deepa Nair',    sport: 'Kabaddi',   team: 'Kabaddi A',    role: 'Defender',  overallScore: 79.8, performance: 80, improvement: 82, fitness: 78, discipline: 80, teamwork: 82, skill: 77, trend: 'UP'     as const },
  { id: '5', name: 'Suresh Kumar',  sport: 'Kabaddi',   team: 'Kabaddi A',    role: 'Raider',    overallScore: 77.3, performance: 78, improvement: 75, fitness: 80, discipline: 76, teamwork: 74, skill: 78, trend: 'DOWN'   as const },
  { id: '6', name: 'Rahul Verma',   sport: 'Cricket',    team: 'Cricket A',    role: 'Bowler',    overallScore: 75.6, performance: 76, improvement: 79, fitness: 73, discipline: 75, teamwork: 76, skill: 74, trend: 'UP'     as const },
  { id: '7', name: 'Priya Singh',   sport: 'Football',   team: 'Football B',   role: 'Striker',   overallScore: 72.1, performance: 73, improvement: 70, fitness: 74, discipline: 71, teamwork: 73, skill: 71, trend: 'DOWN'   as const },
  { id: '8', name: 'Meena Raj',     sport: 'Badminton',  team: 'Badminton A',  role: 'All-Rounder',overallScore: 70.5, performance: 71, improvement: 73, fitness: 70, discipline: 70, teamwork: 69, skill: 70, trend: 'STABLE' as const },
];

const MOCK_TREND_DATA = [
  { month: 'Jan', averageScore: 64, topScore: 88, fitnessScore: 70, teamworkScore: 72 },
  { month: 'Feb', averageScore: 67, topScore: 90, fitnessScore: 73, teamworkScore: 74 },
  { month: 'Mar', averageScore: 70, topScore: 91, fitnessScore: 75, teamworkScore: 76 },
  { month: 'Apr', averageScore: 68, topScore: 89, fitnessScore: 72, teamworkScore: 73 },
  { month: 'May', averageScore: 73, topScore: 93, fitnessScore: 78, teamworkScore: 79 },
  { month: 'Jun', averageScore: 76, topScore: 89, fitnessScore: 80, teamworkScore: 81 },
];

const SPORTS_OPTIONS = ['Cricket', 'Football', 'Kabaddi', 'Volleyball', 'Badminton'].map(s => ({ value: s, label: s }));

const PerformancePage: React.FC = () => {
  const [sportFilter, setSportFilter] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(MOCK_PLAYERS[0]!);
  const [tab, setTab] = useState<'ranking' | 'individual' | 'history'>('ranking');

  const filtered = MOCK_PLAYERS.filter(p => !sportFilter || p.sport === sportFilter)
    .sort((a, b) => b.overallScore - a.overallScore);

  const radarData = [
    { subject: 'Performance',  value: selectedPlayer.performance,  fullMark: 100 },
    { subject: 'Improvement',  value: selectedPlayer.improvement,  fullMark: 100 },
    { subject: 'Fitness',      value: selectedPlayer.fitness,      fullMark: 100 },
    { subject: 'Discipline',   value: selectedPlayer.discipline,   fullMark: 100 },
    { subject: 'Teamwork',     value: selectedPlayer.teamwork,     fullMark: 100 },
    { subject: 'Skill',        value: selectedPlayer.skill,        fullMark: 100 },
  ];

  const topPerformer   = MOCK_PLAYERS[0]!;
  const mostImproved   = [...MOCK_PLAYERS].sort((a, b) => b.improvement - a.improvement)[0]!;
  const avgScore       = Math.round(MOCK_PLAYERS.reduce((sum, p) => sum + p.overallScore, 0) / MOCK_PLAYERS.length * 10) / 10;

  const TrendIcon = ({ trend }: { trend: 'UP' | 'DOWN' | 'STABLE' }) =>
    trend === 'UP'   ? <ArrowUp   size={12} className="text-emerald-400" /> :
    trend === 'DOWN' ? <ArrowDown size={12} className="text-red-400" /> :
                       <Minus     size={12} className="text-gray-400" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Performance Management"
        subtitle="Track and analyze player performance scores"
        icon={<TrendingUp size={22} />}
        iconBg="bg-violet-500/20"
        breadcrumb={[{ label: 'Admin' }, { label: 'Performance' }]}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Team Avg Score"  value={avgScore}             icon={<TrendingUp size={20} />} iconBg="bg-primary-500/20" trend={5} />
        <StatCard title="Top Performer"   value={topPerformer.name.split(' ')[0]!} icon={<Award size={20} />} iconBg="bg-yellow-500/20" subtitle={`Score: ${topPerformer.overallScore}`} />
        <StatCard title="Most Improved"   value={mostImproved.name.split(' ')[0]!} icon={<Star size={20} />}  iconBg="bg-emerald-500/20" subtitle={`+${mostImproved.improvement} pts`} />
        <StatCard title="Total Evaluated" value={MOCK_PLAYERS.length}  icon={<TrendingUp size={20} />} iconBg="bg-cyan-500/20" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-dark-800 border border-dark-700 rounded-xl p-1 w-fit">
        {[
          { key: 'ranking',    label: 'Player Ranking' },
          { key: 'individual', label: 'Individual Analysis' },
          { key: 'history',    label: 'Performance History' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              tab === t.key
                ? 'bg-primary-600/30 text-primary-300 border border-primary-500/30'
                : 'text-gray-400 hover:text-white',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Ranking Tab */}
      {tab === 'ranking' && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <Select
              options={SPORTS_OPTIONS}
              placeholder="All Sports"
              value={sportFilter}
              onChange={e => setSportFilter(e.target.value)}
            />
          </div>
          {/* Top 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {filtered.slice(0, 3).map((p, i) => (
              <div
                key={p.id}
                className={clsx(
                  'bg-dark-800 border rounded-2xl p-5 text-center transition-all hover:-translate-y-0.5 cursor-pointer',
                  i === 0 ? 'border-yellow-500/40 bg-yellow-500/5' :
                  i === 1 ? 'border-gray-400/40 bg-gray-400/5' :
                            'border-amber-700/40 bg-amber-700/5',
                )}
                onClick={() => { setSelectedPlayer(p); setTab('individual'); }}
              >
                <div className="text-3xl mb-2">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</div>
                <Avatar name={p.name} size="md" className="mx-auto mb-2" />
                <p className="font-bold text-white">{p.name}</p>
                <p className="text-xs text-gray-500 mb-2">{p.sport} · {p.role}</p>
                <span className={clsx('inline-block px-3 py-1 rounded-full text-sm font-bold border', getScoreBg(p.overallScore))}>
                  {p.overallScore}
                </span>
              </div>
            ))}
          </div>

          {/* Full Leaderboard */}
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
            <h2 className="text-base font-semibold text-white mb-4">Full Leaderboard</h2>
            <div className="space-y-2">
              {filtered.map((p, i) => (
                <div
                  key={p.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => { setSelectedPlayer(p); setTab('individual'); }}
                >
                  <span className="w-6 text-center text-sm font-bold text-gray-500">#{i + 1}</span>
                  <Avatar name={p.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.team} · {p.role}</p>
                  </div>
                  {/* Score bars */}
                  <div className="hidden sm:flex items-center gap-2">
                    {[
                      { label: 'Perf', value: p.performance },
                      { label: 'Fit',  value: p.fitness },
                      { label: 'Skill',value: p.skill },
                    ].map(s => (
                      <div key={s.label} className="text-center">
                        <p className="text-[10px] text-gray-500">{s.label}</p>
                        <p className="text-xs font-semibold text-gray-300">{s.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendIcon trend={p.trend} />
                    <span className={clsx('text-sm font-bold px-2.5 py-1 rounded-lg border', getScoreBg(p.overallScore))}>
                      {p.overallScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Individual Tab */}
      {tab === 'individual' && (
        <div className="space-y-4">
          {/* Player Selector */}
          <div className="flex flex-wrap gap-2">
            {MOCK_PLAYERS.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPlayer(p)}
                className={clsx(
                  'flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm border transition-all',
                  selectedPlayer.id === p.id
                    ? 'bg-primary-600/20 border-primary-500/50 text-primary-300'
                    : 'bg-dark-800 border-dark-700 text-gray-400 hover:border-dark-600 hover:text-white',
                )}
              >
                <Avatar name={p.name} size="xs" />
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Radar */}
            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <Avatar name={selectedPlayer.name} size="md" />
                <div>
                  <h3 className="font-bold text-white">{selectedPlayer.name}</h3>
                  <p className="text-xs text-gray-500">{selectedPlayer.sport} · {selectedPlayer.role}</p>
                </div>
                <span className={clsx('ml-auto text-lg font-bold px-3 py-1 rounded-xl border', getScoreBg(selectedPlayer.overallScore))}>
                  {selectedPlayer.overallScore}
                </span>
              </div>
              <PerformanceRadarChart data={radarData} height={260} />
            </div>

            {/* Score breakdown */}
            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
              <h3 className="text-base font-semibold text-white mb-4">Score Breakdown</h3>
              <div className="space-y-3">
                {[
                  { label: 'Performance Score', value: selectedPlayer.performance, color: 'bg-primary-500' },
                  { label: 'Improvement Score', value: selectedPlayer.improvement, color: 'bg-emerald-500' },
                  { label: 'Fitness Score',      value: selectedPlayer.fitness,     color: 'bg-cyan-500' },
                  { label: 'Discipline Score',   value: selectedPlayer.discipline,  color: 'bg-amber-500' },
                  { label: 'Teamwork Score',     value: selectedPlayer.teamwork,    color: 'bg-violet-500' },
                  { label: 'Skill Score',        value: selectedPlayer.skill,       color: 'bg-pink-500' },
                ].map(s => (
                  <div key={s.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-400">{s.label}</span>
                      <span className="text-white font-semibold">{s.value}/100</span>
                    </div>
                    <div className="w-full bg-dark-700 rounded-full h-2">
                      <div
                        className={clsx('h-2 rounded-full transition-all duration-500', s.color)}
                        style={{ width: `${s.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {tab === 'history' && (
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
          <h2 className="text-base font-semibold text-white mb-4">Performance History (Last 6 Months)</h2>
          <PerformanceTrendChart data={MOCK_TREND_DATA} height={300} />
        </div>
      )}
    </div>
  );
};

export default PerformancePage;
