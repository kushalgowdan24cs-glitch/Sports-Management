import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Swords, MapPin, Calendar, Star, Award, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import { playerDashboardService } from '@/services/player/playerDashboardService';
import type { PlayerMatchRecord, MatchResult } from '@/types/player.dashboard.types';

const resultConfig: Record<MatchResult, { color: string; bg: string; border: string }> = {
  WIN:  { color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
  LOSS: { color: 'text-red-400',     bg: 'bg-red-500/15',     border: 'border-red-500/30' },
  DRAW: { color: 'text-gray-400',    bg: 'bg-gray-500/15',    border: 'border-gray-500/30' },
};

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 10 }).map((_, i) => (
      <Star
        key={i}
        size={10}
        className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-dark-600'}
      />
    ))}
    <span className="ml-1 text-xs text-amber-400 font-semibold">{rating}/10</span>
  </div>
);

const MatchCard: React.FC<{ match: PlayerMatchRecord }> = ({ match }) => {
  const [expanded, setExpanded] = useState(false);
  const cfg = resultConfig[match.result];

  return (
    <div className={clsx('rounded-2xl border overflow-hidden transition-all duration-300', cfg.border, 'bg-dark-800')}>
      {/* Header */}
      <div className="p-4 flex items-center gap-4">
        <div className={clsx('w-1.5 self-stretch rounded-full shrink-0', cfg.bg, match.result === 'WIN' ? 'bg-emerald-500' : match.result === 'LOSS' ? 'bg-red-500' : 'bg-gray-500')} />

        {/* Score Block */}
        <div className={clsx('flex flex-col items-center justify-center px-4 py-2 rounded-xl shrink-0', cfg.bg)}>
          <p className="text-2xl font-bold text-white leading-none">{match.teamScore}–{match.opponentScore}</p>
          <span className={clsx('text-xs font-semibold mt-1', cfg.color)}>{match.result}</span>
        </div>

        {/* Match Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-sm font-bold text-white">vs {match.opponentName}</h3>
            {match.isManOfMatch && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-semibold border border-amber-500/30">
                <Trophy size={9} /> MOM
              </span>
            )}
            {match.specialAward && !match.isManOfMatch && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-400 text-[10px] font-semibold border border-primary-500/30">
                <Award size={9} /> {match.specialAward}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mb-1">{match.tournamentName}</p>
          <div className="flex flex-wrap gap-3 text-[11px] text-gray-500">
            <span className="flex items-center gap-1"><Calendar size={10} /> {match.matchDate}</span>
            <span className="flex items-center gap-1"><MapPin size={10} /> {match.venue}</span>
          </div>
        </div>

        {/* Rating + Toggle */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <StarRating rating={match.matchRating} />
          <button
            onClick={() => setExpanded(v => !v)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
          >
            {expanded ? <><ChevronUp size={12} /> Less</> : <><ChevronDown size={12} /> Details</>}
          </button>
        </div>
      </div>

      {/* Expandable Details */}
      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-dark-700 animate-fade-in">
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-dark-900/70 border border-dark-700/50">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">My Contribution</p>
              <p className="text-sm text-white">{match.matchContribution}</p>
            </div>
            <div className="p-3 rounded-xl bg-dark-900/70 border border-dark-700/50">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Match Rating</p>
              <StarRating rating={match.matchRating} />
            </div>
            {match.specialAward && (
              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 sm:col-span-2">
                <p className="text-[10px] text-amber-400 uppercase tracking-wider mb-1">Special Award</p>
                <p className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <Trophy size={13} className="text-amber-400" /> {match.specialAward}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const MatchesPage: React.FC = () => {
  const { data: matches, isLoading } = useQuery({
    queryKey: ['player-matches'],
    queryFn: playerDashboardService.getMatches,
  });
  const [filter, setFilter] = useState<'ALL' | MatchResult>('ALL');

  const filtered = (matches ?? []).filter(m => filter === 'ALL' || m.result === filter);
  const wins  = (matches ?? []).filter(m => m.result === 'WIN').length;
  const losses= (matches ?? []).filter(m => m.result === 'LOSS').length;
  const draws = (matches ?? []).filter(m => m.result === 'DRAW').length;
  const winRate = matches?.length ? Math.round((wins / matches.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Match History</h1>
        <p className="text-sm text-gray-400 mt-1">All matches you've participated in this season</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Matches', value: matches?.length ?? '—', color: 'text-white',         bg: 'bg-dark-700/50' },
          { label: 'Wins',          value: wins,                    color: 'text-emerald-400',   bg: 'bg-emerald-500/10' },
          { label: 'Losses',        value: losses,                  color: 'text-red-400',       bg: 'bg-red-500/10' },
          { label: 'Win Rate',      value: `${winRate}%`,           color: 'text-amber-400',     bg: 'bg-amber-500/10' },
        ].map(s => (
          <div key={s.label} className={clsx('rounded-2xl border border-dark-700 p-5 text-center', s.bg)}>
            <p className={clsx('text-3xl font-bold', s.color)}>{isLoading ? '—' : s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['ALL', 'WIN', 'LOSS', 'DRAW'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              'px-4 py-1.5 rounded-xl text-xs font-semibold transition-all border',
              filter === f
                ? f === 'WIN' ? 'bg-emerald-600 text-white border-emerald-500'
                : f === 'LOSS' ? 'bg-red-600 text-white border-red-500'
                : f === 'DRAW' ? 'bg-gray-600 text-white border-gray-500'
                : 'bg-primary-600 text-white border-primary-500'
                : 'bg-dark-800 text-gray-400 border-dark-700 hover:text-white',
            )}
          >
            {f === 'ALL' ? `All (${matches?.length ?? 0})` : f === 'WIN' ? `Wins (${wins})` : f === 'LOSS' ? `Losses (${losses})` : `Draws (${draws})`}
          </button>
        ))}
      </div>

      {/* Match Cards */}
      <div className="space-y-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-dark-800 border border-dark-700 rounded-2xl animate-pulse" />
            ))
          : filtered.map(m => <MatchCard key={m.id} match={m} />)
        }
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Swords size={32} className="mx-auto mb-3 opacity-30" />
            <p>No matches found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchesPage;
