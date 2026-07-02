import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle, XCircle, Clock, Calendar, Users, TrendingUp,
  AlertTriangle, ChevronDown, Save, RefreshCw,
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { captainService } from '@/services/captain/captainService';
import type { AttendanceStatus } from '@/types/captain.types';
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

type AttTab = 'mark' | 'summary' | 'records' | 'trends';

const STATUS_STYLES: Record<AttendanceStatus, string> = {
  PRESENT: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  ABSENT:  'bg-red-500/20 text-red-400 border-red-500/30',
  LATE:    'bg-amber-500/20 text-amber-400 border-amber-500/30',
  NONE:    'bg-dark-700 text-gray-400 border-dark-600',
};

const AttendancePage: React.FC = () => {
  const { data, isLoading } = useQuery({ queryKey: ['captain-attendance'], queryFn: captainService.getAttendance });
  const { data: players }   = useQuery({ queryKey: ['captain-players'],    queryFn: captainService.getPlayers });

  const [activeTab, setActiveTab]     = useState<AttTab>('mark');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterDate, setFilterDate]   = useState<string>('');
  const [sessionType, setSessionType] = useState<string>('PRACTICE');
  const [saved, setSaved]             = useState(false);

  // Mark attendance local state
  const [attendanceMap, setAttendanceMap] = useState<Record<string, { status: AttendanceStatus; remarks: string }>>({});

  const toggleStatus = (playerId: string, current: AttendanceStatus) => {
    const cycle: AttendanceStatus[] = ['PRESENT', 'LATE', 'ABSENT', 'NONE'];
    const next = cycle[(cycle.indexOf(current) + 1) % cycle.length];
    setAttendanceMap(prev => ({ ...prev, [playerId]: { ...prev[playerId], status: next } }));
  };

  const handleSaveAttendance = async () => {
    await new Promise(r => setTimeout(r, 600));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs: { id: AttTab; label: string }[] = [
    { id: 'mark',    label: 'Mark Attendance' },
    { id: 'summary', label: 'Daily Summary' },
    { id: 'records', label: 'Player Records' },
    { id: 'trends',  label: 'Trends' },
  ];

  const filteredRecords = (data?.records ?? []).filter(r => {
    const statusMatch = filterStatus === 'ALL' || r.status === filterStatus;
    const dateMatch   = !filterDate || r.date === filterDate;
    return statusMatch && dateMatch;
  });

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Attendance Management</h1>
          <p className="text-sm text-gray-400 mt-1">Mark and monitor your team's daily attendance</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
          <Calendar size={14} className="text-emerald-400" />
          <p className="text-xs font-semibold text-emerald-300">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Sessions',   value: data?.totalSessions ?? '—',         icon: <Calendar size={16} />,      color: 'text-gray-400',    bg: 'bg-gray-500/10' },
          { label: 'Avg Attendance %', value: `${data?.overallPercentage ?? 0}%`, icon: <TrendingUp size={16} />,    color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Low Attendance',   value: data?.lowAttendancePlayers.length ?? '—', icon: <AlertTriangle size={16} />, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Team Size',        value: players?.length ?? '—',             icon: <Users size={16} />,         color: 'text-cyan-400',    bg: 'bg-cyan-500/10' },
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

      {/* Attendance Rate Bar */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-5">
        <div className="relative w-28 h-28 shrink-0">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#1f2937" strokeWidth="12" />
            <circle cx="60" cy="60" r="50" fill="none"
              stroke="#10b981" strokeWidth="12"
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
          <p className="text-sm text-gray-400 mb-3">Target: <span className="text-emerald-400 font-semibold">90%</span> · Current: <span className="text-white font-semibold">{data?.overallPercentage ?? 0}%</span></p>
          <div className="h-2.5 bg-dark-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
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

        {/* Mark Attendance Tab */}
        {activeTab === 'mark' && (
          <div className="p-5">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-400">Date:</label>
                <input type="date" defaultValue={todayStr}
                  className="bg-dark-900 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex items-center gap-2 relative">
                <label className="text-xs text-gray-400">Session:</label>
                <select value={sessionType} onChange={e => setSessionType(e.target.value)}
                  className="bg-dark-900 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white appearance-none pr-8 focus:outline-none focus:border-emerald-500"
                >
                  {['PRACTICE', 'MATCH', 'FITNESS'].map(s => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button onClick={() => setAttendanceMap({})}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-3 py-2 rounded-xl bg-dark-900 border border-dark-700 transition-colors">
                  <RefreshCw size={12} /> Reset
                </button>
                <button onClick={handleSaveAttendance}
                  className="flex items-center gap-1.5 text-xs text-white px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition-colors">
                  <Save size={12} /> {saved ? '✓ Saved!' : 'Save Attendance'}
                </button>
              </div>
            </div>

            {/* Quick Mark All */}
            <div className="flex gap-2 mb-4">
              {(['PRESENT', 'ABSENT', 'LATE'] as AttendanceStatus[]).map(status => (
                <button key={status} onClick={() => {
                  const newMap: Record<string, { status: AttendanceStatus; remarks: string }> = {};
                  (players ?? []).forEach(p => { newMap[p.id] = { status, remarks: '' }; });
                  setAttendanceMap(newMap);
                }}
                  className={clsx('text-xs px-3 py-1.5 rounded-lg border transition-colors', STATUS_STYLES[status])}>
                  Mark All {status}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {(players ?? []).map(player => {
                const att = attendanceMap[player.id] ?? { status: 'NONE' as AttendanceStatus, remarks: '' };
                return (
                  <div key={player.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-dark-900/60 border border-dark-700/50 hover:border-dark-600 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-emerald-400">#{player.jerseyNumber}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">{player.name}</p>
                      <p className="text-[10px] text-gray-500">{player.usn} · {player.playingRole}</p>
                    </div>
                    <input
                      type="text"
                      placeholder="Remarks..."
                      value={att.remarks}
                      onChange={e => setAttendanceMap(prev => ({ ...prev, [player.id]: { ...att, remarks: e.target.value } }))}
                      className="hidden sm:block w-36 bg-dark-800 border border-dark-700 rounded-lg px-2 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={() => toggleStatus(player.id, att.status)}
                      className={clsx('flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold min-w-[90px] justify-center transition-all', STATUS_STYLES[att.status])}>
                      {att.status === 'PRESENT' && <><CheckCircle size={13} /> PRESENT</>}
                      {att.status === 'ABSENT'  && <><XCircle size={13} /> ABSENT</>}
                      {att.status === 'LATE'    && <><Clock size={13} /> LATE</>}
                      {att.status === 'NONE'    && <span className="text-gray-500">TAP TO MARK</span>}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Daily Summary Tab */}
        {activeTab === 'summary' && (
          <div className="p-5">
            <h4 className="text-sm font-semibold text-white mb-4">Last 7 Days Team Attendance</h4>
            <div className="space-y-2.5">
              {(data?.teamSummary ?? []).map(day => (
                <div key={day.date} className="flex items-center gap-3 p-3 rounded-xl bg-dark-900/60 border border-dark-700/50">
                  <div className="w-20 shrink-0">
                    <p className="text-xs font-medium text-white">{day.date}</p>
                    <p className="text-[10px] text-gray-500">{day.percentage}%</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex gap-0.5 h-2.5 rounded-full overflow-hidden bg-dark-700">
                      <div className="bg-emerald-500 rounded-full" style={{ width: `${(day.present / day.totalPlayers) * 100}%` }} />
                      <div className="bg-amber-500 rounded-full"   style={{ width: `${(day.late    / day.totalPlayers) * 100}%` }} />
                      <div className="bg-red-500 rounded-full"     style={{ width: `${(day.absent  / day.totalPlayers) * 100}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-[11px]">
                    <span className="flex items-center gap-1 text-emerald-400"><CheckCircle size={10} /> {day.present}</span>
                    <span className="flex items-center gap-1 text-amber-400"><Clock size={10} /> {day.late}</span>
                    <span className="flex items-center gap-1 text-red-400"><XCircle size={10} /> {day.absent}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Player Records Tab */}
        {activeTab === 'records' && (
          <div className="p-5">
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="relative">
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                  className="bg-dark-900 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white appearance-none pr-8 focus:outline-none focus:border-emerald-500">
                  {['ALL','PRESENT','ABSENT','LATE'].map(s => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
              <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
                className="bg-dark-900 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
              {(filterStatus !== 'ALL' || filterDate) && (
                <button onClick={() => { setFilterStatus('ALL'); setFilterDate(''); }}
                  className="px-3 py-2 text-xs text-gray-400 hover:text-white bg-dark-900 border border-dark-700 rounded-xl transition-colors">
                  Clear
                </button>
              )}
            </div>
            <div className="rounded-xl overflow-hidden border border-dark-700">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-dark-900/80">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Player</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium hidden sm:table-cell">USN</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium hidden md:table-cell">Date</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium hidden lg:table-cell">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.slice(0, 25).map((rec, idx) => {
                    const statusStyle = STATUS_STYLES[rec.status] ?? STATUS_STYLES.NONE;
                    return (
                      <tr key={rec.id} className={clsx('border-t border-dark-700/50', idx % 2 === 0 ? 'bg-dark-900/30' : '')}>
                        <td className="py-3 px-4 font-medium text-white">{rec.playerName}</td>
                        <td className="py-3 px-4 text-gray-500 hidden sm:table-cell">{rec.usn}</td>
                        <td className="py-3 px-4 text-gray-500 hidden md:table-cell">{rec.date}</td>
                        <td className="py-3 px-4">
                          <span className={clsx('px-2 py-0.5 rounded-full text-[10px] font-medium border', statusStyle)}>{rec.status}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-500 hidden lg:table-cell">{rec.remarks || '—'}</td>
                      </tr>
                    );
                  })}
                  {filteredRecords.length === 0 && (
                    <tr><td colSpan={5} className="py-8 text-center text-gray-500">No records found</td></tr>
                  )}
                </tbody>
              </table>
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
                  <Line type="monotone" dataKey="percentage" name="Attendance %" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4 }} />
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
