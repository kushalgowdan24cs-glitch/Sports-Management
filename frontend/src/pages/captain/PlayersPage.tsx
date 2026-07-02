import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Users, TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { captainService } from '@/services/captain/captainService';
import { Avatar } from '@/components/common/Avatar';
import clsx from 'clsx';

const PlayersPage: React.FC = () => {
  const { data: players, isLoading } = useQuery({ queryKey: ['captain-players'], queryFn: captainService.getPlayers });

  const [search, setSearch]         = useState('');
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [viewMode, setViewMode]     = useState<'grid' | 'table'>('grid');

  const departments = ['ALL', ...Array.from(new Set((players ?? []).map(p => p.department)))];

  const filtered = (players ?? []).filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.usn.toLowerCase().includes(search.toLowerCase());
    const matchDept   = filterDept === 'ALL' || p.department === filterDept;
    const matchStatus = filterStatus === 'ALL' || p.status === filterStatus;
    return matchSearch && matchDept && matchStatus;
  });

  const selectedPlayerData = players?.find(p => p.id === selectedPlayer);

  const statusColors: Record<string, string> = {
    ACTIVE:    'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    INJURED:   'text-red-400 bg-red-500/10 border-red-500/20',
    SUSPENDED: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Team Players</h1>
          <p className="text-sm text-gray-400 mt-1">View your assigned team roster — {players?.length ?? '—'} players</p>
        </div>
        {/* Read-only notice */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25">
          <Info size={14} className="text-amber-400 shrink-0" />
          <p className="text-xs text-amber-300">View only — Player management belongs to Coach</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Players', value: players?.length ?? '—',                                                icon: <Users size={16} />,        color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Active',        value: players?.filter(p => p.status === 'ACTIVE').length ?? '—',            icon: <TrendingUp size={16} />,   color: 'text-green-400',   bg: 'bg-green-500/10' },
          { label: 'Injured',       value: players?.filter(p => p.isInjured).length ?? '—',                     icon: <AlertTriangle size={16} />, color: 'text-red-400',     bg: 'bg-red-500/10' },
          { label: 'Avg Score',     value: `${Math.round((players ?? []).reduce((s, p) => s + p.performanceScore, 0) / (players?.length || 1))}`, icon: <TrendingUp size={16} />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Player List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="text" placeholder="Search by name or USN..." value={search} onChange={e => setSearch(e.target.value)}
                id="captain-player-search"
                className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
              className="bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white appearance-none focus:outline-none focus:border-emerald-500">
              {departments.map(d => <option key={d}>{d}</option>)}
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white appearance-none focus:outline-none focus:border-emerald-500">
              {['ALL','ACTIVE','INJURED','SUSPENDED'].map(s => <option key={s}>{s}</option>)}
            </select>
            <div className="flex rounded-xl overflow-hidden border border-dark-700">
              {(['grid', 'table'] as const).map(m => (
                <button key={m} onClick={() => setViewMode(m)}
                  className={clsx('px-3 py-2 text-xs transition-colors', viewMode === m ? 'bg-emerald-600 text-white' : 'bg-dark-800 text-gray-400 hover:text-white')}>
                  {m === 'grid' ? '⊞' : '≡'}
                </button>
              ))}
            </div>
          </div>

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered.map(player => (
                <button key={player.id} onClick={() => setSelectedPlayer(player.id === selectedPlayer ? null : player.id)}
                  className={clsx(
                    'text-left p-4 rounded-2xl border transition-all hover:-translate-y-0.5',
                    selectedPlayer === player.id
                      ? 'bg-emerald-600/15 border-emerald-500/40'
                      : 'bg-dark-800 border-dark-700 hover:border-emerald-500/30',
                  )}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                      <Avatar name={player.name} size="md" />
                      {player.jerseyNumber && (
                        <span className="absolute -bottom-1 -right-1 text-[9px] font-bold bg-emerald-600 text-white px-1 rounded-full">
                          #{player.jerseyNumber}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{player.name}</p>
                      <p className="text-[10px] text-gray-500">{player.usn}</p>
                    </div>
                    <span className={clsx('text-[9px] font-bold px-2 py-0.5 rounded-full border', statusColors[player.status])}>
                      {player.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div><span className="text-gray-500">Dept: </span><span className="text-gray-300">{player.department.split(' ')[0]}</span></div>
                    <div><span className="text-gray-500">Role: </span><span className="text-gray-300">{player.playingRole}</span></div>
                    <div><span className="text-gray-500">Att: </span><span className={player.attendancePercentage < 75 ? 'text-red-400 font-semibold' : 'text-emerald-400'}>{player.attendancePercentage}%</span></div>
                    <div><span className="text-gray-500">Score: </span><span className="text-amber-400 font-semibold">{player.performanceScore}</span></div>
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="sm:col-span-2 py-12 text-center">
                  <Filter size={32} className="mx-auto text-dark-600 mb-3" />
                  <p className="text-gray-500 text-sm">No players match your filters</p>
                </div>
              )}
            </div>
          )}

          {/* Table View */}
          {viewMode === 'table' && (
            <div className="rounded-2xl overflow-hidden border border-dark-700">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-dark-900/80">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Player</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium hidden sm:table-cell">USN</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium hidden md:table-cell">Role</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Att %</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Score</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((player, idx) => (
                    <tr key={player.id}
                      onClick={() => setSelectedPlayer(player.id === selectedPlayer ? null : player.id)}
                      className={clsx('border-t border-dark-700/50 cursor-pointer transition-colors', idx % 2 === 0 ? 'bg-dark-900/30' : '', 'hover:bg-emerald-500/5')}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Avatar name={player.name} size="sm" />
                          <span className="font-medium text-white">{player.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-500 hidden sm:table-cell">{player.usn}</td>
                      <td className="py-3 px-4 text-gray-400 hidden md:table-cell">{player.playingRole}</td>
                      <td className="py-3 px-4">
                        <span className={player.attendancePercentage < 75 ? 'text-red-400 font-semibold' : 'text-emerald-400'}>{player.attendancePercentage}%</span>
                      </td>
                      <td className="py-3 px-4 text-amber-400 font-semibold">{player.performanceScore}</td>
                      <td className="py-3 px-4">
                        <span className={clsx('px-2 py-0.5 rounded-full text-[10px] font-medium border', statusColors[player.status])}>{player.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Player Detail Panel */}
        <div className="lg:col-span-1">
          {selectedPlayerData ? (
            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 sticky top-4 space-y-4">
              <div className="flex flex-col items-center text-center pb-4 border-b border-dark-700">
                <div className="relative mb-3">
                  <Avatar name={selectedPlayerData.name} size="xl" className="w-20 h-20 text-2xl" />
                  <span className="absolute -bottom-1 -right-1 text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded-full">
                    #{selectedPlayerData.jerseyNumber}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{selectedPlayerData.name}</h3>
                <p className="text-xs text-emerald-400">{selectedPlayerData.playingRole}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{selectedPlayerData.usn}</p>
                <span className={clsx('mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full border', statusColors[selectedPlayerData.status])}>
                  {selectedPlayerData.status}
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  { label: 'Department', value: selectedPlayerData.department },
                  { label: 'Year',       value: selectedPlayerData.year },
                  { label: 'Sport',      value: selectedPlayerData.sport },
                  { label: 'Email',      value: selectedPlayerData.email },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-2">
                    <span className="text-[10px] text-gray-500 w-20 shrink-0 pt-0.5">{item.label}</span>
                    <span className="text-xs text-white">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-dark-900/60 rounded-xl p-3 text-center">
                  <p className={clsx('text-xl font-bold', selectedPlayerData.attendancePercentage < 75 ? 'text-red-400' : 'text-emerald-400')}>
                    {selectedPlayerData.attendancePercentage}%
                  </p>
                  <p className="text-[10px] text-gray-500">Attendance</p>
                </div>
                <div className="bg-dark-900/60 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-amber-400">{selectedPlayerData.performanceScore}</p>
                  <p className="text-[10px] text-gray-500">Performance</p>
                </div>
              </div>

              {selectedPlayerData.isInjured && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/25">
                  <AlertTriangle size={14} className="text-red-400 shrink-0" />
                  <p className="text-xs text-red-300">Player is currently on injury rest</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-dark-700 flex items-center justify-center mb-4">
                <Users size={24} className="text-dark-500" />
              </div>
              <p className="text-sm text-gray-500">Select a player to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayersPage;
