import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronDown, Eye, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import { vcDashboardService } from '@/services/vice-captain/vcDashboardService';
import type { VCTeamPlayer } from '@/types/vice-captain.types';
import { Avatar } from '@/components/common/Avatar';
import { ROUTES } from '@/utils/constants';
import clsx from 'clsx';

const PlayersPage: React.FC = () => {
  const { data: players = [], isLoading } = useQuery({ queryKey: ['vc-players'], queryFn: vcDashboardService.getPlayers });
  const navigate = useNavigate();
  const [search, setSearch]       = useState('');
  const [filterStatus, setFilter] = useState<string>('ALL');
  const [sortBy, setSortBy]       = useState<keyof VCTeamPlayer>('name');

  const filtered = players
    .filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.usn.toLowerCase().includes(search.toLowerCase()) ||
                          p.department.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'ALL' || p.status === filterStatus;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'performanceScore' || sortBy === 'attendancePercentage') {
        return (b[sortBy] as number) - (a[sortBy] as number);
      }
      return String(a[sortBy]).localeCompare(String(b[sortBy]));
    });

  const statuses = ['ALL', 'ACTIVE', 'INJURED', 'SUSPENDED'];

  const getAttBadge = (pct: number) =>
    pct >= 90 ? 'bg-emerald-500/15 text-emerald-400' :
    pct >= 75 ? 'bg-amber-500/15 text-amber-400' :
               'bg-red-500/15 text-red-400';

  const getScoreBadge = (score: number) =>
    score >= 85 ? 'bg-violet-500/15 text-violet-400' :
    score >= 70 ? 'bg-blue-500/15 text-blue-400' :
                 'bg-red-500/15 text-red-400';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Team Players</h1>
        <p className="text-sm text-gray-400 mt-1">View and monitor players in your team</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Players', value: players.length,                                         color: 'text-violet-400', bg: 'bg-violet-500/10' },
          { label: 'Active',        value: players.filter(p => p.status === 'ACTIVE').length,      color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Injured',       value: players.filter(p => p.isInjured).length,                color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Low Attendance',value: players.filter(p => p.attendancePercentage < 75).length, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        ].map(s => (
          <div key={s.label} className="bg-dark-800 border border-dark-700 rounded-2xl p-4">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={clsx('text-2xl font-bold mt-1', s.color)}>{isLoading ? '—' : s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 max-w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text" placeholder="Search by name, USN, department..."
            value={search} onChange={e => setSearch(e.target.value)}
            id="vc-players-search"
            className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500
                       focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
          />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <select value={filterStatus} onChange={e => setFilter(e.target.value)}
            className="bg-dark-800 border border-dark-700 rounded-xl pl-9 pr-8 py-2.5 text-sm text-white appearance-none
                       focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30">
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
        <div className="relative">
          <select value={sortBy as string} onChange={e => setSortBy(e.target.value as keyof VCTeamPlayer)}
            className="bg-dark-800 border border-dark-700 rounded-xl px-3 pr-8 py-2.5 text-sm text-white appearance-none
                       focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30">
            <option value="name">Sort: Name</option>
            <option value="performanceScore">Sort: Performance ↓</option>
            <option value="attendancePercentage">Sort: Attendance ↓</option>
            <option value="department">Sort: Department</option>
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Players Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-dark-800 border border-dark-700 rounded-2xl p-5 animate-pulse h-48" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(player => (
            <PlayerCard key={player.id} player={player} getAttBadge={getAttBadge} getScoreBadge={getScoreBadge} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-gray-500 text-sm">No players found matching your filters.</div>
          )}
        </div>
      )}

      <p className="text-xs text-gray-600 text-center">
        Showing {filtered.length} of {players.length} players · Vice Captain view only (read-only)
      </p>
    </div>
  );
};

const PlayerCard: React.FC<{
  player: VCTeamPlayer;
  getAttBadge: (n: number) => string;
  getScoreBadge: (n: number) => string;
}> = ({ player, getAttBadge, getScoreBadge }) => (
  <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 hover:border-violet-500/30 hover:-translate-y-0.5 transition-all duration-200 group">
    <div className="flex items-center gap-3 mb-4">
      <div className="relative">
        <Avatar name={player.name} size="md" />
        {player.jerseyNumber && (
          <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-violet-600 border-2 border-dark-800 text-[9px] font-bold text-white flex items-center justify-center">
            {player.jerseyNumber}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{player.name}</p>
        <p className="text-[11px] text-gray-500 truncate">{player.usn}</p>
      </div>
      <div className="shrink-0">
        {player.isInjured ? (
          <span className="flex items-center gap-1 text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
            <Activity size={9} /> Injured
          </span>
        ) : (
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Active</span>
        )}
      </div>
    </div>

    <div className="space-y-2 text-xs">
      <div className="flex justify-between text-gray-500">
        <span>{player.department}</span>
        <span>{player.year}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">{player.playingRole}</span>
        <span className="text-gray-400">{player.sport}</span>
      </div>
    </div>

    <div className="mt-4 pt-3 border-t border-dark-700 grid grid-cols-2 gap-2">
      <div>
        <p className="text-[10px] text-gray-500 mb-1">Attendance</p>
        <span className={clsx('text-xs font-bold px-2 py-0.5 rounded-full', getAttBadge(player.attendancePercentage))}>
          {player.attendancePercentage}%
        </span>
      </div>
      <div>
        <p className="text-[10px] text-gray-500 mb-1">Performance</p>
        <span className={clsx('text-xs font-bold px-2 py-0.5 rounded-full', getScoreBadge(player.performanceScore))}>
          {player.performanceScore}
        </span>
      </div>
    </div>

    {player.isInjured && player.injuryType && (
      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-orange-400">
        <AlertTriangle size={10} /> {player.injuryType}
      </div>
    )}
  </div>
);

export default PlayersPage;
