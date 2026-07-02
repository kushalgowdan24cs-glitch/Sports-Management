import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Swords, MapPin, Calendar, Trophy, Users, ChevronDown, CheckCircle, XCircle } from 'lucide-react';
import { captainService } from '@/services/captain/captainService';
import type { CaptainMatch } from '@/types/captain.types';
import clsx from 'clsx';

const RESULT_STYLES: Record<string, string> = {
  WIN:      'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  LOSS:     'text-red-400 bg-red-500/10 border-red-500/20',
  DRAW:     'text-gray-400 bg-gray-500/10 border-gray-500/20',
  UPCOMING: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
};

const MatchesPage: React.FC = () => {
  const { data: matches, isLoading } = useQuery({ queryKey: ['captain-matches'], queryFn: captainService.getMatches });
  const { data: players }            = useQuery({ queryKey: ['captain-players'], queryFn: captainService.getPlayers });

  const [selectedMatch, setSelectedMatch] = useState<CaptainMatch | null>(null);
  const [activeFilter, setActiveFilter]   = useState<string>('ALL');
  const [participationMap, setParticipationMap] = useState<Record<string, boolean>>({});

  const filters = ['ALL', 'UPCOMING', 'WIN', 'LOSS', 'DRAW'];

  const filtered = (matches ?? []).filter(m =>
    activeFilter === 'ALL' || m.result === activeFilter
  );

  const upcoming = (matches ?? []).filter(m => m.result === 'UPCOMING');
  const past      = (matches ?? []).filter(m => m.result !== 'UPCOMING');
  const wins      = past.filter(m => m.result === 'WIN').length;
  const losses    = past.filter(m => m.result === 'LOSS').length;

  const toggleParticipation = (playerId: string) => {
    setParticipationMap(prev => ({ ...prev, [playerId]: !prev[playerId] }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Match Management</h1>
        <p className="text-sm text-gray-400 mt-1">View schedule, results, and manage player participation</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Matches',    value: matches?.length ?? '—',    color: 'text-gray-400',    bg: 'bg-gray-500/10',    icon: <Swords size={16} /> },
          { label: 'Upcoming',         value: upcoming.length,           color: 'text-amber-400',   bg: 'bg-amber-500/10',   icon: <Calendar size={16} /> },
          { label: 'Wins',             value: wins,                      color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: <Trophy size={16} /> },
          { label: 'Losses',           value: losses,                    color: 'text-red-400',     bg: 'bg-red-500/10',     icon: <XCircle size={16} /> },
        ].map(s => (
          <div key={s.label} className="bg-dark-800 border border-dark-700 rounded-2xl p-4 flex items-center gap-3">
            <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', s.bg, s.color)}>{s.icon}</div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-xl font-bold text-white">{isLoading ? '—' : s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Match List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter Pills */}
          <div className="flex gap-2 flex-wrap">
            {filters.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className={clsx(
                  'px-4 py-1.5 rounded-full text-xs font-medium border transition-all',
                  activeFilter === f
                    ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-400'
                    : 'bg-dark-800 border-dark-700 text-gray-400 hover:text-white',
                )}>
                {f}
              </button>
            ))}
          </div>

          {/* Match Cards */}
          <div className="space-y-3">
            {filtered.map(match => (
              <button key={match.id} onClick={() => setSelectedMatch(selectedMatch?.id === match.id ? null : match)}
                className={clsx(
                  'w-full text-left p-4 rounded-2xl border transition-all hover:-translate-y-0.5',
                  selectedMatch?.id === match.id
                    ? 'bg-emerald-600/10 border-emerald-500/40'
                    : 'bg-dark-800 border-dark-700 hover:border-emerald-500/30',
                )}>
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border', RESULT_STYLES[match.result ?? 'UPCOMING'])}>
                    <Swords size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-white">vs {match.opponentTeam}</p>
                      <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded-full border', RESULT_STYLES[match.result ?? 'UPCOMING'])}>
                        {match.result}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{match.tournamentName}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-500">
                      <span className="flex items-center gap-1"><Calendar size={10} /> {match.matchDate}</span>
                      <span className="flex items-center gap-1"><MapPin size={10} /> {match.venue.split(',')[0]}</span>
                    </div>
                  </div>
                  {/* Score */}
                  {match.result !== 'UPCOMING' && match.teamScore != null && (
                    <div className="text-right shrink-0">
                      <p className={clsx('text-lg font-bold', match.result === 'WIN' ? 'text-emerald-400' : 'text-red-400')}>
                        {match.teamScore}–{match.opponentScore}
                      </p>
                      <p className="text-[10px] text-gray-500">Final Score</p>
                    </div>
                  )}
                  {match.result === 'UPCOMING' && (
                    <div className="text-right shrink-0">
                      <p className="text-xs text-amber-400 font-semibold">{match.playersAvailable} ready</p>
                      <p className="text-[10px] text-gray-500">players</p>
                    </div>
                  )}
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="py-12 text-center">
                <Swords size={32} className="mx-auto text-dark-600 mb-3" />
                <p className="text-gray-500">No matches in this category</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          {selectedMatch ? (
            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 sticky top-4 space-y-4">
              <div>
                <div className={clsx('inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border mb-3', RESULT_STYLES[selectedMatch.result ?? 'UPCOMING'])}>
                  {selectedMatch.result}
                </div>
                <h3 className="text-base font-bold text-white">vs {selectedMatch.opponentTeam}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{selectedMatch.tournamentName}</p>
              </div>

              <div className="space-y-2">
                {[
                  { label: 'Date',  value: selectedMatch.matchDate, icon: <Calendar size={13} /> },
                  { label: 'Venue', value: selectedMatch.venue,     icon: <MapPin size={13} /> },
                  { label: 'Sport', value: selectedMatch.sport,     icon: <Trophy size={13} /> },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3 p-2.5 rounded-xl bg-dark-900/60 border border-dark-700/50">
                    <span className="text-gray-500 mt-0.5 shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-[10px] text-gray-500">{item.label}</p>
                      <p className="text-xs text-white">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Score */}
              {selectedMatch.result !== 'UPCOMING' && selectedMatch.teamScore != null && (
                <div className="flex items-center justify-around p-4 rounded-xl bg-dark-900/60 border border-dark-700/50">
                  <div className="text-center">
                    <p className={clsx('text-3xl font-black', selectedMatch.result === 'WIN' ? 'text-emerald-400' : 'text-red-400')}>
                      {selectedMatch.teamScore}
                    </p>
                    <p className="text-[10px] text-gray-500">Our Team</p>
                  </div>
                  <span className="text-xl font-bold text-gray-600">vs</span>
                  <div className="text-center">
                    <p className="text-3xl font-black text-gray-400">{selectedMatch.opponentScore}</p>
                    <p className="text-[10px] text-gray-500">{selectedMatch.opponentTeam}</p>
                  </div>
                </div>
              )}

              {/* Player Participation (for upcoming) */}
              {selectedMatch.result === 'UPCOMING' && (
                <div>
                  <p className="text-xs font-semibold text-white mb-3 flex items-center gap-1.5">
                    <Users size={13} className="text-emerald-400" /> Player Participation
                  </p>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {(players ?? []).map(player => (
                      <div key={player.id} className="flex items-center gap-2.5 p-2 rounded-xl bg-dark-900/60 border border-dark-700/50">
                        <p className="text-xs text-white flex-1 truncate">{player.name.split(' ')[0]}</p>
                        <button onClick={() => toggleParticipation(player.id)}
                          className={clsx(
                            'flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-lg border transition-all',
                            player.isInjured
                              ? 'text-red-400 bg-red-500/10 border-red-500/20 cursor-not-allowed'
                              : participationMap[player.id] === false
                              ? 'text-red-400 bg-red-500/10 border-red-500/20'
                              : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                          )}
                          disabled={player.isInjured}>
                          {player.isInjured ? <><XCircle size={10} /> Injured</> :
                           participationMap[player.id] === false ? <><XCircle size={10} /> Out</> :
                           <><CheckCircle size={10} /> Available</>}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-dark-700 flex items-center justify-center mb-4">
                <Swords size={24} className="text-dark-500" />
              </div>
              <p className="text-sm text-gray-500">Select a match to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchesPage;
