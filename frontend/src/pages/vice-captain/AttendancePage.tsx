import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle, XCircle, Clock, Calendar, Users, TrendingUp,
  AlertTriangle, ToggleLeft, ToggleRight, ChevronDown,
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { vcDashboardService } from '@/services/vice-captain/vcDashboardService';
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

type AttTab = 'summary' | 'records' | 'trends';

const AttendancePage: React.FC = () => {
  const { data, isLoading } = useQuery({ queryKey: ['vc-attendance'], queryFn: vcDashboardService.getAttendance });
  const [activeTab, setActiveTab]         = useState<AttTab>('summary');
  const [captainAbsent, setCaptainAbsent] = useState(false);
  const [filterStatus, setFilterStatus]   = useState<string>('ALL');
  const [filterDate, setFilterDate]       = useState<string>('');

  const tabs: { id: AttTab; label: string }[] = [
    { id: 'summary', label: 'Daily Summary' },
    { id: 'records', label: 'Player Records' },
    { id: 'trends',  label: 'Trends' },
  ];

  const filteredRecords = (data?.records ?? []).filter(r => {
    const statusMatch = filterStatus === 'ALL' || r.status === filterStatus;
    const dateMatch   = !filterDate || r.date === filterDate;
    return statusMatch && dateMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Team Attendance</h1>
          <p className="text-sm text-gray-400 mt-1">Monitor your team's attendance and session records</p>
        </div>
        {/* Conditional permission toggle */}
        <div className={clsx(
          'flex items-center gap-3 px-4 py-3 rounded-xl border transition-all',
          captainAbsent ? 'bg-amber-500/10 border-amber-500/30' : 'bg-dark-800 border-dark-700',
        )}>
          <AlertTriangle size={14} className={captainAbsent ? 'text-amber-400' : 'text-gray-500'} />
          <div>
            <p className="text-xs font-medium text-white">Captain Absent Mode</p>
            <p className="text-[10px] text-gray-500">{captainAbsent ? 'Mark attendance enabled' : 'View only'}</p>
          </div>
          <button onClick={() => setCaptainAbsent(v => !v)} className="ml-2 transition-colors">
            {captainAbsent
              ? <ToggleRight size={24} className="text-amber-400" />
              : <ToggleLeft  size={24} className="text-gray-600" />}
          </button>
        </div>
      </div>

      {captainAbsent && (
        <div className="flex items-start gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
          <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-300">
            <span className="font-semibold">Captain Absent Mode active.</span> You can now mark and edit today's attendance for your team. All changes are logged.
          </p>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Sessions',    value: data?.totalSessions ?? '—',      icon: <Calendar size={16} />, color: 'text-gray-400',    bg: 'bg-gray-500/10' },
          { label: 'Avg Attendance %',  value: `${data?.overallPercentage ?? 0}%`, icon: <TrendingUp size={16} />, color: 'text-violet-400', bg: 'bg-violet-500/10' },
          { label: 'Low Attendance',    value: data?.lowAttendancePlayers.length ?? '—', icon: <AlertTriangle size={16} />, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Team Size',         value: 12,                                icon: <Users size={16} />,    color: 'text-cyan-400',   bg: 'bg-cyan-500/10' },
        ].map(s => (
          <div key={s.label} className="bg-dark-800 border border-dark-700 rounded-2xl p-4 flex items-center gap-3">
            <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', s.bg, s.color)}>
              {s.icon}
            </div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-xl font-bold text-white">{isLoading ? '—' : s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Attendance % summary bar */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-5">
        <div className="relative w-28 h-28 shrink-0">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#1f2937" strokeWidth="12" />
            <circle cx="60" cy="60" r="50" fill="none"
              stroke="#8b5cf6" strokeWidth="12"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - (data?.overallPercentage ?? 0) / 100)}`}
              strokeLinecap="round" className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">{data?.overallPercentage ?? 0}%</span>
            <span className="text-[10px] text-gray-500">Team Avg</span>
          </div>
        </div>
        <div className="flex-1 w-full">
          <h3 className="text-base font-bold text-white mb-1">Team Attendance Rate</h3>
          <p className="text-sm text-gray-400 mb-3">Target: <span className="text-violet-400 font-semibold">90%</span> · Current: <span className="text-white font-semibold">{data?.overallPercentage ?? 0}%</span></p>
          <div className="h-2.5 bg-dark-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full transition-all duration-700"
              style={{ width: `${data?.overallPercentage ?? 0}%` }} />
          </div>
          {(data?.lowAttendancePlayers ?? []).length > 0 && (
            <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
              <AlertTriangle size={11} />
              {data?.lowAttendancePlayers.length} player(s) below 75% threshold
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
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

        {/* Daily Summary Tab */}
        {activeTab === 'summary' && (
          <div className="p-5">
            <h4 className="text-sm font-semibold text-white mb-4">Last 7 Days Team Attendance</h4>
            <div className="space-y-2.5">
              {(data?.teamSummary ?? []).map(day => (
                <div key={day.date} className="flex items-center gap-3 p-3 rounded-xl bg-dark-900/60 border border-dark-700/50">
                  <div className="w-24 shrink-0">
                    <p className="text-xs font-medium text-white">{day.date}</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-dark-700">
                      <div className="bg-emerald-500 rounded-full" style={{ width: `${(day.present / day.totalPlayers) * 100}%` }} />
                      <div className="bg-amber-500 rounded-full"   style={{ width: `${(day.late    / day.totalPlayers) * 100}%` }} />
                      <div className="bg-red-500 rounded-full"     style={{ width: `${(day.absent  / day.totalPlayers) * 100}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 text-[11px]">
                    <span className="flex items-center gap-1 text-emerald-400"><CheckCircle size={10} /> {day.present}</span>
                    <span className="flex items-center gap-1 text-amber-400"><Clock size={10} /> {day.late}</span>
                    <span className="flex items-center gap-1 text-red-400"><XCircle size={10} /> {day.absent}</span>
                    <span className="text-gray-500 ml-1 font-semibold">{day.percentage}%</span>
                  </div>
                  {captainAbsent && (
                    <button className="shrink-0 text-[10px] px-2 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-colors">
                      Edit
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Player Records Tab */}
        {activeTab === 'records' && (
          <div className="p-5">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="bg-dark-900 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white appearance-none pr-8
                             focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30"
                >
                  {['ALL','PRESENT','ABSENT','LATE','EXCUSED'].map(s => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
              <input
                type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
                className="bg-dark-900 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white
                           focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30"
              />
              {(filterStatus !== 'ALL' || filterDate) && (
                <button onClick={() => { setFilterStatus('ALL'); setFilterDate(''); }}
                  className="px-3 py-2 text-xs text-gray-400 hover:text-white bg-dark-900 border border-dark-700 rounded-xl transition-colors">
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {filteredRecords.slice(0, 30).map(rec => {
                const statusStyle: Record<string, string> = {
                  PRESENT: 'text-emerald-400 bg-emerald-500/10',
                  ABSENT:  'text-red-400 bg-red-500/10',
                  LATE:    'text-amber-400 bg-amber-500/10',
                  EXCUSED: 'text-blue-400 bg-blue-500/10',
                };
                return (
                  <div key={rec.id} className="flex items-center gap-3 p-3 rounded-xl bg-dark-900/60 border border-dark-700/50">
                    <span className="text-xs text-gray-300 w-20 shrink-0">{rec.date}</span>
                    <span className="text-xs text-white flex-1 font-medium">{rec.playerName}</span>
                    <span className="text-xs text-gray-500 w-16 shrink-0">{rec.sessionType}</span>
                    <span className={clsx('text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0', statusStyle[rec.status] ?? 'text-gray-400')}>{rec.status}</span>
                  </div>
                );
              })}
              {filteredRecords.length === 0 && (
                <p className="text-center text-gray-500 text-sm py-6">No records found</p>
              )}
            </div>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div className="p-5 space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Monthly Attendance</h4>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data?.monthlyTrend ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
                  <Bar dataKey="present" name="Present" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="absent"  name="Absent"  fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="late"    name="Late"    fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Attendance % Trend</h4>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={data?.monthlyTrend ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[70, 105]} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="percentage" name="Attendance %" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: '#8b5cf6', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
