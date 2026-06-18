import React, { useState } from 'react';
import {
  ClipboardList, Calendar, Users, CheckCircle, XCircle,
  Download, Filter, ChevronLeft, ChevronRight, Clock,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/common/Button';
import { Select } from '@/components/common/Select';
import { Badge, StatusBadge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';
import { StatCard } from '@/components/common/StatCard';
import { AttendanceChart } from '@/components/charts/AttendanceChart';
import { SPORTS } from '@/utils/constants';
import { formatDate } from '@/utils/dateUtils';
import clsx from 'clsx';

const MOCK_TEAMS = [
  { value: 't1', label: 'Cricket A' },
  { value: 't2', label: 'Football B' },
  { value: 't3', label: 'Kabaddi A' },
  { value: 't4', label: 'Volleyball A' },
];

const MOCK_RECORDS = [
  { id: '1', playerName: 'Arjun Sharma',  sport: 'Cricket',  team: 'Cricket A',    status: 'PRESENT' as const, date: '2026-06-16', percentage: 92 },
  { id: '2', playerName: 'Rahul Verma',   sport: 'Cricket',  team: 'Cricket A',    status: 'PRESENT' as const, date: '2026-06-16', percentage: 87 },
  { id: '3', playerName: 'Priya Singh',   sport: 'Football', team: 'Football B',   status: 'ABSENT'  as const, date: '2026-06-16', percentage: 73 },
  { id: '4', playerName: 'Kiran Patel',   sport: 'Football', team: 'Football B',   status: 'PRESENT' as const, date: '2026-06-16', percentage: 95 },
  { id: '5', playerName: 'Suresh Kumar',  sport: 'Kabaddi',  team: 'Kabaddi A',    status: 'LATE'    as const, date: '2026-06-16', percentage: 81 },
  { id: '6', playerName: 'Deepa Nair',    sport: 'Kabaddi',  team: 'Kabaddi A',    status: 'PRESENT' as const, date: '2026-06-16', percentage: 88 },
  { id: '7', playerName: 'Amit Joshi',    sport: 'Volleyball', team: 'Volleyball A', status: 'PRESENT' as const, date: '2026-06-16', percentage: 96 },
  { id: '8', playerName: 'Meena Raj',     sport: 'Badminton', team: 'Badminton A',  status: 'EXCUSED' as const, date: '2026-06-16', percentage: 79 },
];

const MOCK_TREND = [
  { date: '10 Jun', present: 75, absent: 12, total: 87, percentage: 86 },
  { date: '11 Jun', present: 68, absent: 19, total: 87, percentage: 78 },
  { date: '12 Jun', present: 80, absent: 7,  total: 87, percentage: 92 },
  { date: '13 Jun', present: 71, absent: 16, total: 87, percentage: 82 },
  { date: '14 Jun', present: 77, absent: 10, total: 87, percentage: 89 },
  { date: '15 Jun', present: 84, absent: 3,  total: 87, percentage: 97 },
  { date: '16 Jun', present: 71, absent: 16, total: 87, percentage: 82 },
];

const MONTHLY = [
  { month: 'Jan', sessions: 22, avg: 84 }, { month: 'Feb', sessions: 20, avg: 79 },
  { month: 'Mar', sessions: 23, avg: 87 }, { month: 'Apr', sessions: 21, avg: 82 },
  { month: 'May', sessions: 24, avg: 91 }, { month: 'Jun', sessions: 18, avg: 85 },
];

const AttendancePage: React.FC = () => {
  const [teamFilter, setTeamFilter] = useState('');
  const [sportFilter, setSportFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'daily' | 'calendar' | 'monthly'>('daily');
  const [calendarDate, setCalendarDate] = useState(new Date());

  const filtered = MOCK_RECORDS.filter(r =>
    (!teamFilter || r.team === MOCK_TEAMS.find(t => t.value === teamFilter)?.label) &&
    (!sportFilter || r.sport === sportFilter),
  );

  const present  = filtered.filter(r => r.status === 'PRESENT').length;
  const absent   = filtered.filter(r => r.status === 'ABSENT').length;
  const late     = filtered.filter(r => r.status === 'LATE').length;
  const excused  = filtered.filter(r => r.status === 'EXCUSED').length;
  const rate     = filtered.length > 0 ? Math.round((present / filtered.length) * 100) : 0;

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(calendarDate);

  const prevMonth = () => setCalendarDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCalendarDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  // Simulate some calendar data
  const calendarDayData: Record<number, { rate: number; type: 'high' | 'medium' | 'low' | 'none' }> = {};
  for (let d = 1; d <= daysInMonth; d++) {
    const rate = Math.floor(Math.random() * 40) + 60;
    calendarDayData[d] = {
      rate,
      type: rate >= 85 ? 'high' : rate >= 70 ? 'medium' : 'low',
    };
  }
  // Future days have no data
  const today = new Date().getDate();
  for (let d = today + 1; d <= daysInMonth; d++) {
    calendarDayData[d] = { rate: 0, type: 'none' };
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Management"
        subtitle="Track and monitor player attendance across all teams"
        icon={<ClipboardList size={22} />}
        iconBg="bg-emerald-500/20"
        breadcrumb={[{ label: 'Admin' }, { label: 'Attendance' }]}
        actions={
          <Button variant="outline" size="sm" leftIcon={<Download size={14} />}>
            Export Report
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Present Today"    value={present}  icon={<CheckCircle size={20} />} iconBg="bg-emerald-500/20" />
        <StatCard title="Absent Today"     value={absent}   icon={<XCircle size={20} />}     iconBg="bg-red-500/20" />
        <StatCard title="Late Today"       value={late}     icon={<Clock size={20} />}        iconBg="bg-amber-500/20" />
        <StatCard title="Attendance Rate"  value={`${rate}%`} icon={<Users size={20} />}     iconBg="bg-primary-500/20" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select
          options={MOCK_TEAMS}
          placeholder="All Teams"
          value={teamFilter}
          onChange={e => setTeamFilter(e.target.value)}
        />
        <Select
          options={SPORTS.map(s => ({ value: s, label: s }))}
          placeholder="All Sports"
          value={sportFilter}
          onChange={e => setSportFilter(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-dark-800 border border-dark-700 rounded-xl p-1 w-fit">
        {[
          { key: 'daily',    label: 'Daily Records',   icon: ClipboardList },
          { key: 'calendar', label: 'Calendar View',   icon: Calendar },
          { key: 'monthly',  label: 'Monthly Report',  icon: Filter },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as typeof activeTab)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === t.key
                ? 'bg-primary-600/30 text-primary-300 border border-primary-500/30'
                : 'text-gray-400 hover:text-white',
            )}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Daily Records */}
      {activeTab === 'daily' && (
        <div className="space-y-4">
          {/* Attendance Trend */}
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
            <h2 className="text-base font-semibold text-white mb-4">7-Day Attendance Trend</h2>
            <AttendanceChart data={MOCK_TREND} height={220} />
          </div>

          {/* Present/Absent Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                <CheckCircle size={14} /> Present Players ({present + late})
              </h3>
              <div className="space-y-2">
                {filtered.filter(r => r.status === 'PRESENT' || r.status === 'LATE').map(r => (
                  <div key={r.id} className="flex items-center justify-between py-2 border-b border-dark-700/50">
                    <div className="flex items-center gap-2">
                      <Avatar name={r.playerName} size="xs" />
                      <span className="text-sm text-white">{r.playerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{r.team}</span>
                      <StatusBadge status={r.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
                <XCircle size={14} /> Absent / Excused ({absent + excused})
              </h3>
              <div className="space-y-2">
                {filtered.filter(r => r.status === 'ABSENT' || r.status === 'EXCUSED').map(r => (
                  <div key={r.id} className="flex items-center justify-between py-2 border-b border-dark-700/50">
                    <div className="flex items-center gap-2">
                      <Avatar name={r.playerName} size="xs" />
                      <span className="text-sm text-white">{r.playerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{r.team}</span>
                      <StatusBadge status={r.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Full Table */}
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
            <h2 className="text-base font-semibold text-white mb-4">All Attendance Records — {formatDate(new Date().toISOString())}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-700 text-xs font-semibold text-gray-400 uppercase">
                    <th className="px-3 py-2 text-left">Player</th>
                    <th className="px-3 py-2 text-left">Team</th>
                    <th className="px-3 py-2 text-left">Sport</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-right">Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={r.id} className={clsx('border-b border-dark-700/50', i % 2 === 0 ? 'bg-dark-900/40' : '')}>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={r.playerName} size="xs" />
                          <span className="text-white font-medium">{r.playerName}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-gray-400">{r.team}</td>
                      <td className="px-3 py-3 text-gray-400">{r.sport}</td>
                      <td className="px-3 py-3"><StatusBadge status={r.status} /></td>
                      <td className="px-3 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 bg-dark-700 rounded-full h-1.5">
                            <div
                              className={clsx('h-1.5 rounded-full', r.percentage >= 85 ? 'bg-emerald-500' : r.percentage >= 70 ? 'bg-amber-500' : 'bg-red-500')}
                              style={{ width: `${r.percentage}%` }}
                            />
                          </div>
                          <span className={clsx('text-xs font-medium', r.percentage >= 85 ? 'text-emerald-400' : r.percentage >= 70 ? 'text-amber-400' : 'text-red-400')}>
                            {r.percentage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Calendar View */}
      {activeTab === 'calendar' && (
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-white">
              {calendarDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-1">
              <button onClick={prevMonth} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <ChevronLeft size={16} />
              </button>
              <button onClick={nextMonth} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center text-xs font-semibold text-gray-500 py-2">{d}</div>
            ))}
          </div>

          {/* Calendar cells */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayData = calendarDayData[day];
              const isToday = day === today && calendarDate.getMonth() === new Date().getMonth();
              return (
                <div
                  key={day}
                  className={clsx(
                    'aspect-square flex flex-col items-center justify-center rounded-lg text-xs transition-colors cursor-pointer',
                    isToday && 'ring-2 ring-primary-500',
                    dayData?.type === 'high'   ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30' :
                    dayData?.type === 'medium' ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30' :
                    dayData?.type === 'low'    ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' :
                    'bg-dark-700/30 text-gray-600',
                  )}
                >
                  <span className="font-medium">{day}</span>
                  {dayData?.type !== 'none' && (
                    <span className="text-[9px] opacity-80">{dayData?.rate}%</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 justify-center">
            {[
              { color: 'bg-emerald-500/40', label: '≥85% (High)' },
              { color: 'bg-amber-500/40',   label: '70-84% (Med)' },
              { color: 'bg-red-500/40',     label: '<70% (Low)' },
              { color: 'bg-dark-700/30',    label: 'No data' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5 text-xs text-gray-400">
                <div className={`w-3 h-3 rounded ${l.color}`} />
                {l.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Report */}
      {activeTab === 'monthly' && (
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
          <h2 className="text-base font-semibold text-white mb-5">Monthly Attendance Report</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-700 text-xs font-semibold text-gray-400 uppercase">
                  <th className="px-4 py-2 text-left">Month</th>
                  <th className="px-4 py-2 text-right">Sessions</th>
                  <th className="px-4 py-2 text-right">Avg Attendance</th>
                  <th className="px-4 py-2 text-right">Progress</th>
                </tr>
              </thead>
              <tbody>
                {MONTHLY.map((m, i) => (
                  <tr key={m.month} className={clsx('border-b border-dark-700/50', i % 2 === 0 ? 'bg-dark-900/40' : '')}>
                    <td className="px-4 py-3 text-white font-medium">{m.month} 2026</td>
                    <td className="px-4 py-3 text-right text-gray-300">{m.sessions}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={clsx('font-semibold', m.avg >= 85 ? 'text-emerald-400' : m.avg >= 70 ? 'text-amber-400' : 'text-red-400')}>
                        {m.avg}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-24 bg-dark-700 rounded-full h-2">
                          <div
                            className={clsx('h-2 rounded-full', m.avg >= 85 ? 'bg-emerald-500' : m.avg >= 70 ? 'bg-amber-500' : 'bg-red-500')}
                            style={{ width: `${m.avg}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
