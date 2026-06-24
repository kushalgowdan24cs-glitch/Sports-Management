import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle, XCircle, Clock, Calendar, Flame, TrendingUp,
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { playerDashboardService } from '@/services/player/playerDashboardService';
import type { DayStatus } from '@/types/player.dashboard.types';
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

const statusConfig: Record<DayStatus, { color: string; icon: React.ReactNode; label: string }> = {
  PRESENT: { color: 'bg-emerald-500', icon: <CheckCircle size={11} className="text-emerald-400" />, label: 'Present' },
  ABSENT:  { color: 'bg-red-500',     icon: <XCircle size={11} className="text-red-400" />,     label: 'Absent' },
  LATE:    { color: 'bg-amber-500',   icon: <Clock size={11} className="text-amber-400" />,     label: 'Late' },
  EXCUSED: { color: 'bg-blue-500',    icon: <CheckCircle size={11} className="text-blue-400" />, label: 'Excused' },
  NONE:    { color: 'bg-dark-700',    icon: null,                                                 label: 'No Session' },
};

const AttendancePage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['player-attendance'],
    queryFn: playerDashboardService.getAttendance,
  });
  const [activeTab, setActiveTab] = useState<'chart' | 'records'>('chart');

  const tabs = [
    { id: 'chart' as const, label: 'Charts' },
    { id: 'records' as const, label: 'Records' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Attendance</h1>
        <p className="text-sm text-gray-400 mt-1">Track your attendance history and trends</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Sessions', value: data?.totalSessions ?? '—', icon: <Calendar size={16} />, color: 'text-gray-400', bg: 'bg-gray-500/10' },
          { label: 'Present Days', value: data?.presentDays ?? '—', icon: <CheckCircle size={16} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Absent Days', value: data?.absentDays ?? '—', icon: <XCircle size={16} />, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Late Entries', value: data?.lateDays ?? '—', icon: <Clock size={16} />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Current Streak', value: data?.currentStreak ? `${data.currentStreak} days` : '—', icon: <Flame size={16} />, color: 'text-orange-400', bg: 'bg-orange-500/10' },
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

      {/* Attendance % Ring */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-32 h-32 shrink-0">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#1f2937" strokeWidth="12" />
            <circle
              cx="60" cy="60" r="50" fill="none"
              stroke="#10b981" strokeWidth="12"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - (data?.attendancePercentage ?? 0) / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">{data?.attendancePercentage ?? 0}%</span>
            <span className="text-[10px] text-gray-500">Overall</span>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-white mb-1">Attendance Rate</h3>
          <p className="text-sm text-gray-400 mb-3">
            You've attended <span className="text-emerald-400 font-semibold">{data?.presentDays}</span> out of{' '}
            <span className="text-white font-semibold">{data?.totalSessions}</span> sessions this semester.
          </p>
          <div className="flex flex-wrap gap-3">
            {Object.entries(statusConfig).filter(([k]) => k !== 'NONE').map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className={clsx('w-2.5 h-2.5 rounded-full', cfg.color)} />
                <span className="text-xs text-gray-400">{cfg.label}</span>
              </div>
            ))}
          </div>
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{data?.attendancePercentage ?? 0}%</span>
            </div>
            <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                style={{ width: `${data?.attendancePercentage ?? 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
        <div className="flex border-b border-dark-700">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={clsx(
                'flex-1 py-3 text-sm font-medium transition-colors',
                activeTab === t.id
                  ? 'bg-emerald-500/10 text-emerald-400 border-b-2 border-emerald-500'
                  : 'text-gray-400 hover:text-white',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'chart' && (
          <div className="p-6 space-y-6">
            {/* Monthly Bar Chart */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Monthly Attendance</h4>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data?.monthlyStats ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
                  <Bar dataKey="present" name="Present" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="absent" name="Absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="late" name="Late" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Percentage Trend */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Attendance % Trend</h4>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={data?.monthlyStats ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[70, 105]} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="percentage" name="Attendance %" stroke="#06b6d4" strokeWidth={2.5} dot={{ fill: '#06b6d4', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="p-6">
            <h4 className="text-sm font-semibold text-white mb-4">Daily Records (Last 30 Days)</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {(data?.records ?? []).slice().reverse().map(rec => {
                const cfg = statusConfig[rec.status] ?? statusConfig.NONE;
                return (
                  <div key={rec.date} className="flex items-center gap-3 p-3 rounded-xl bg-dark-900/60 border border-dark-700/50">
                    <span className={clsx('w-2 h-2 rounded-full shrink-0', cfg.color)} />
                    <span className="text-xs text-gray-300 w-24 shrink-0">{rec.date}</span>
                    <span className="text-xs text-gray-500 flex-1">{rec.sessionType}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      {cfg.icon}
                      <span className={clsx('text-xs font-medium',
                        rec.status === 'PRESENT' ? 'text-emerald-400' :
                        rec.status === 'ABSENT' ? 'text-red-400' :
                        rec.status === 'LATE' ? 'text-amber-400' : 'text-blue-400'
                      )}>
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
