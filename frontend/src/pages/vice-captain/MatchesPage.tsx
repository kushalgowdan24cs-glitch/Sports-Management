import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
  Swords, Calendar, MapPin, Users, Activity, ChevronRight,
  Upload, FileText, CheckCircle, Clock,
} from 'lucide-react';
import { vcDashboardService } from '@/services/vice-captain/vcDashboardService';
import type { VCMatch } from '@/types/vice-captain.types';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import clsx from 'clsx';

const resultColors: Record<string, string> = {
  WIN:      'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  LOSS:     'bg-red-500/15 text-red-400 border-red-500/25',
  DRAW:     'bg-gray-500/15 text-gray-400 border-gray-500/25',
  UPCOMING: 'bg-violet-500/15 text-violet-400 border-violet-500/25',
};

const MatchesPage: React.FC = () => {
  const { data: matches = [], isLoading } = useQuery({ queryKey: ['vc-matches'], queryFn: vcDashboardService.getMatches });
  const [selected, setSelected] = useState<VCMatch | null>(null);
  const [notesSuccess, setNotesSuccess] = useState(false);
  const { register, handleSubmit, reset } = useForm<{ notes: string }>();

  const upcoming = matches.filter(m => m.result === 'UPCOMING');
  const past     = matches.filter(m => m.result !== 'UPCOMING');

  const onSubmitNotes = async (data: { notes: string }) => {
    await new Promise(r => setTimeout(r, 500));
    console.log('Match notes submitted:', data);
    setNotesSuccess(true);
    reset();
    setTimeout(() => setNotesSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Match Coordination</h1>
        <p className="text-sm text-gray-400 mt-1">View match schedule, coordinate prep, and submit match notes</p>
      </div>

      {/* Upcoming Matches — featured */}
      {upcoming.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Upcoming Matches</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {upcoming.map(match => (
              <div key={match.id}
                className="bg-dark-800 border border-violet-500/25 rounded-2xl p-5 cursor-pointer hover:border-violet-500/50 hover:-translate-y-0.5 transition-all"
                onClick={() => setSelected(match === selected ? null : match)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-medium text-violet-400 uppercase tracking-wider">{match.tournamentName}</span>
                    <h3 className="text-base font-bold text-white mt-0.5">vs {match.opponentTeam}</h3>
                  </div>
                  <span className={clsx('text-[10px] font-bold px-2.5 py-1 rounded-full border', resultColors[match.result ?? 'UPCOMING'])}>
                    UPCOMING
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-gray-400">
                  <div className="flex items-center gap-2"><Calendar size={12} className="text-violet-400" /> {match.matchDate}</div>
                  <div className="flex items-center gap-2"><MapPin size={12} className="text-violet-400" /> {match.venue}</div>
                </div>
                {/* Match prep widget */}
                <div className="mt-4 pt-3 border-t border-dark-700 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-emerald-500/10 rounded-xl py-2">
                    <p className="text-emerald-400 font-bold text-base">{match.playersAvailable}</p>
                    <p className="text-gray-500 text-[10px]">Available</p>
                  </div>
                  <div className="bg-red-500/10 rounded-xl py-2">
                    <p className="text-red-400 font-bold text-base">{match.playersInjured}</p>
                    <p className="text-gray-500 text-[10px]">Injured</p>
                  </div>
                  <div className="bg-amber-500/10 rounded-xl py-2">
                    <p className="text-amber-400 font-bold text-base">{match.playersAbsent}</p>
                    <p className="text-gray-500 text-[10px]">Absent</p>
                  </div>
                </div>
                {match.expectedLineup && match.expectedLineup.length > 0 && (
                  <div className="mt-3">
                    <p className="text-[10px] text-gray-500 mb-1.5">Expected Lineup</p>
                    <div className="flex flex-wrap gap-1">
                      {match.expectedLineup.map(p => (
                        <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">{p.split(' ')[0]}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-3 text-xs text-violet-400 flex items-center gap-1">
                  <ChevronRight size={12} /> Click to submit match notes
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Match Notes Form */}
      {selected && (
        <div className="bg-dark-800 border border-violet-500/30 rounded-2xl p-5 animate-slide-up">
          <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
            <FileText size={14} className="text-violet-400" /> Submit Match Notes — vs {selected.opponentTeam}
          </h3>
          <p className="text-xs text-gray-500 mb-4">Notes will be shared with the Captain and Coach</p>
          {notesSuccess && (
            <div className="mb-3 px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
              <CheckCircle size={13} /> Notes submitted successfully!
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmitNotes)} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Match Notes / Observations</label>
              <textarea
                {...register('notes', { required: true })} rows={4} placeholder="E.g., Team formation, player availability notes, strategy observations..."
                className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white
                           focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 resize-none placeholder-gray-600"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" size="sm">Submit Notes</Button>
              <button type="button" onClick={() => { setSelected(null); reset(); }}
                className="text-xs text-gray-400 hover:text-white transition-colors">Cancel</button>
              <button type="button" className="ml-auto flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg bg-dark-700 border border-dark-600 transition-colors">
                <Upload size={12} /> Upload Photos (placeholder)
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Past Matches */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Match History</h2>
        <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
          <div className="divide-y divide-dark-700">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 bg-dark-800 animate-pulse" />)
              : past.map(match => (
                <div key={match.id} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                  <div className={clsx('w-1.5 h-12 rounded-full shrink-0',
                    match.result === 'WIN' ? 'bg-emerald-500' : match.result === 'LOSS' ? 'bg-red-500' : 'bg-gray-500')} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">vs {match.opponentTeam}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{match.tournamentName}</p>
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-600">
                      <span className="flex items-center gap-1"><Calendar size={9} /> {match.matchDate}</span>
                      <span className="flex items-center gap-1"><MapPin size={9} /> {match.venue.split(',')[0]}</span>
                    </div>
                  </div>
                  <div className="text-center shrink-0">
                    {match.teamScore !== undefined && (
                      <p className="text-sm font-bold text-white">{match.teamScore}–{match.opponentScore}</p>
                    )}
                    <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded-full border', resultColors[match.result ?? 'UPCOMING'])}>
                      {match.result}
                    </span>
                  </div>
                  {match.notes && (
                    <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-gray-500 max-w-40">
                      <Clock size={9} className="shrink-0" />
                      <span className="truncate">{match.notes}</span>
                    </div>
                  )}
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchesPage;
