import React, { useState } from 'react';
import { BarChart3, Users, Star, Zap, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { AttendanceChart } from '@/components/charts/AttendanceChart';
import { PerformanceTrendChart } from '@/components/charts/PerformanceChart';
import { GroupedTeamChart } from '@/components/charts/TeamComparisonChart';
import { MatchStatsChart } from '@/components/charts/MatchStatsChart';
import { Avatar } from '@/components/common/Avatar';
import { Select } from '@/components/common/Select';
import clsx from 'clsx';

const ATTENDANCE_DATA = [
  { date: '10 Jun', present: 75, absent: 12, total: 87, percentage: 86 },
  { date: '11 Jun', present: 68, absent: 19, total: 87, percentage: 78 },
  { date: '12 Jun', present: 80, absent: 7,  total: 87, percentage: 92 },
  { date: '13 Jun', present: 71, absent: 16, total: 87, percentage: 82 },
  { date: '14 Jun', present: 77, absent: 10, total: 87, percentage: 89 },
  { date: '15 Jun', present: 84, absent: 3,  total: 87, percentage: 97 },
  { date: '16 Jun', present: 71, absent: 16, total: 87, percentage: 82 },
];

const PERFORMANCE_DATA = [
  { month: 'Jan', averageScore: 64, topScore: 88, fitnessScore: 70, teamworkScore: 72 },
  { month: 'Feb', averageScore: 67, topScore: 90, fitnessScore: 73, teamworkScore: 74 },
  { month: 'Mar', averageScore: 70, topScore: 91, fitnessScore: 75, teamworkScore: 76 },
  { month: 'Apr', averageScore: 68, topScore: 89, fitnessScore: 72, teamworkScore: 73 },
  { month: 'May', averageScore: 73, topScore: 93, fitnessScore: 78, teamworkScore: 79 },
  { month: 'Jun', averageScore: 76, topScore: 95, fitnessScore: 80, teamworkScore: 81 },
];

const TEAM_DATA = [
  { teamName: 'Cricket A',    sport: 'Cricket',    averageScore: 82, attendanceRate: 89, wins: 8, players: 15 },
  { teamName: 'Football B',   sport: 'Football',   averageScore: 76, attendanceRate: 84, wins: 5, players: 18 },
  { teamName: 'Kabaddi A',    sport: 'Kabaddi',    averageScore: 79, attendanceRate: 91, wins: 7, players: 12 },
  { teamName: 'Volleyball A', sport: 'Volleyball', averageScore: 74, attendanceRate: 87, wins: 4, players: 12 },
  { teamName: 'Badminton A',  sport: 'Badminton',  averageScore: 71, attendanceRate: 82, wins: 6, players: 10 },
];

const BEST_PLAYERS = [
  { category: 'Best Raider',           name: 'Suresh Kumar',  sport: 'Kabaddi',    value: 94, emoji: '⚡' },
  { category: 'Best Defender',         name: 'Deepa Nair',    sport: 'Kabaddi',    value: 91, emoji: '🛡️' },
  { category: 'Best All-Rounder',      name: 'Amit Joshi',    sport: 'Volleyball', value: 88, emoji: '🌟' },
  { category: 'Most Consistent',       name: 'Arjun Sharma',  sport: 'Cricket',    value: 92, emoji: '📊' },
  { category: 'Most Improved',         name: 'Rahul Verma',   sport: 'Cricket',    value: '+18', emoji: '📈' },
];

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics Dashboard"
        subtitle="Comprehensive insights across all teams and players"
        icon={<BarChart3 size={22} />}
        iconBg="bg-cyan-500/20"
        breadcrumb={[{ label: 'Admin' }, { label: 'Analytics' }]}
        actions={
          <Select
            options={[
              { value: '7',  label: 'Last 7 days' },
              { value: '30', label: 'Last 30 days' },
              { value: '90', label: 'Last 3 months' },
            ]}
            value={timeRange}
            onChange={e => setTimeRange(e.target.value)}
          />
        }
      />

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Overall Avg Score"  value="76.2" icon={<TrendingUp size={20} />} iconBg="bg-primary-500/20" trend={6} />
        <StatCard title="Avg Attendance"     value="87%"  icon={<Users size={20} />}      iconBg="bg-emerald-500/20" trend={3} />
        <StatCard title="Total Matches"      value="13"   icon={<Star size={20} />}        iconBg="bg-amber-500/20" />
        <StatCard title="Win Rate"           value="62%"  icon={<Zap size={20} />}         iconBg="bg-violet-500/20" trend={8} />
      </div>

      {/* Best Player Widgets */}
      <div>
        <h2 className="text-base font-semibold text-white mb-3">⭐ Hall of Fame</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {BEST_PLAYERS.map(p => (
            <div
              key={p.category}
              className="bg-dark-800 border border-dark-700 rounded-2xl p-4 text-center hover:border-primary-500/30 hover:-translate-y-0.5 transition-all"
            >
              <div className="text-2xl mb-2">{p.emoji}</div>
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">{p.category}</p>
              <Avatar name={p.name} size="md" className="mx-auto mb-2" />
              <p className="text-sm font-bold text-white leading-tight">{p.name}</p>
              <p className="text-[10px] text-gray-500 mb-2">{p.sport}</p>
              <div className="text-sm font-bold text-primary-400">{p.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Attendance Trends */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
          <h2 className="text-base font-semibold text-white mb-4">📅 Attendance Trends</h2>
          <AttendanceChart data={ATTENDANCE_DATA} height={240} />
        </div>

        {/* Match Stats */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
          <h2 className="text-base font-semibold text-white mb-4">⚽ Match Results</h2>
          <MatchStatsChart wins={8} losses={3} draws={2} height={200} />
          <div className="grid grid-cols-3 gap-3 mt-3">
            {[
              { label: 'Wins',   value: 8, color: 'text-emerald-400' },
              { label: 'Losses', value: 3, color: 'text-red-400' },
              { label: 'Draws',  value: 2, color: 'text-gray-400' },
            ].map(s => (
              <div key={s.label} className="text-center bg-dark-900/60 rounded-xl p-2">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Trends */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
        <h2 className="text-base font-semibold text-white mb-4">📈 Performance Trends (6 Months)</h2>
        <PerformanceTrendChart data={PERFORMANCE_DATA} height={280} />
      </div>

      {/* Team Comparison */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
        <h2 className="text-base font-semibold text-white mb-4">🏆 Team Comparison</h2>
        <GroupedTeamChart data={TEAM_DATA} height={280} />
      </div>

      {/* Team Summary Table */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
        <h2 className="text-base font-semibold text-white mb-4">Team Performance Summary</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-700 text-xs text-gray-400 uppercase">
                <th className="px-4 py-2 text-left">Team</th>
                <th className="px-4 py-2 text-right">Players</th>
                <th className="px-4 py-2 text-right">Avg Score</th>
                <th className="px-4 py-2 text-right">Attendance</th>
                <th className="px-4 py-2 text-right">Wins</th>
              </tr>
            </thead>
            <tbody>
              {TEAM_DATA.map((t, i) => (
                <tr key={t.teamName} className={clsx('border-b border-dark-700/50', i % 2 === 0 ? 'bg-dark-900/40' : '')}>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-white font-medium">{t.teamName}</p>
                      <p className="text-xs text-gray-500">{t.sport}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-300">{t.players}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={clsx('font-semibold', t.averageScore >= 80 ? 'text-emerald-400' : t.averageScore >= 70 ? 'text-amber-400' : 'text-red-400')}>
                      {t.averageScore}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 bg-dark-700 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-primary-500" style={{ width: `${t.attendanceRate}%` }} />
                      </div>
                      <span className="text-sm text-gray-300">{t.attendanceRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-emerald-400 font-semibold">{t.wins}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
