import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MessageSquare, Plus, X, ChevronDown, Save } from 'lucide-react';
import { captainService } from '@/services/captain/captainService';
import type { CreateFeedbackForm } from '@/types/captain.types';
import { useForm } from 'react-hook-form';
import { Avatar } from '@/components/common/Avatar';
import clsx from 'clsx';

const CAT_COLORS: Record<string, string> = {
  SKILL:       'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  FITNESS:     'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  TEAMWORK:    'text-blue-400 bg-blue-500/10 border-blue-500/20',
  DISCIPLINE:  'text-amber-400 bg-amber-500/10 border-amber-500/20',
  GENERAL:     'text-gray-400 bg-gray-500/10 border-gray-500/20',
};

const REMARK_PRESETS = [
  'Improve Raid Timing',
  'Good Defensive Effort',
  'Work On Fitness',
  'Excellent All-Round Play',
  'Improve Team Coordination',
  'Outstanding Discipline',
  'Good Improvement This Month',
  'Work On Communication',
  'Strengthen Core Muscles',
  'Focus On Match Awareness',
  '',
];

const FeedbackPage: React.FC = () => {
  const { data: feedback, isLoading } = useQuery({ queryKey: ['captain-feedback'],    queryFn: captainService.getFeedback });
  const { data: players }             = useQuery({ queryKey: ['captain-players'],     queryFn: captainService.getPlayers });

  const [showForm, setShowForm]   = useState(false);
  const [saved, setSaved]         = useState(false);
  const [filterPlayer, setFilterPlayer] = useState('ALL');
  const [filterCat, setFilterCat]   = useState('ALL');

  const { register, handleSubmit, reset } = useForm<CreateFeedbackForm>({
    defaultValues: {
      playerId: '',
      feedbackTitle: '',
      remarks: '',
      date: new Date().toISOString().split('T')[0],
      category: 'SKILL',
    },
  });

  const onSubmit = async (data: CreateFeedbackForm) => {
    await new Promise(r => setTimeout(r, 600));
    console.log('Feedback created:', data);
    setSaved(true);
    reset();
    setTimeout(() => { setSaved(false); setShowForm(false); }, 2000);
  };

  const playerOptions = ['ALL', ...(players ?? []).map(p => p.id)];
  const categories = ['ALL', 'SKILL', 'FITNESS', 'TEAMWORK', 'DISCIPLINE', 'GENERAL'];

  const filtered = (feedback ?? []).filter(f => {
    const matchPlayer = filterPlayer === 'ALL' || f.playerId === filterPlayer;
    const matchCat    = filterCat === 'ALL' || f.category === filterCat;
    return matchPlayer && matchCat;
  });

  const getPlayerName = (id: string) => players?.find(p => p.id === id)?.name ?? id;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Player Feedback</h1>
          <p className="text-sm text-gray-400 mt-1">Provide daily coaching feedback to your players</p>
        </div>
        <button onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors">
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'New Feedback'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.filter(c => c !== 'ALL').map(cat => (
          <div key={cat} className="bg-dark-800 border border-dark-700 rounded-2xl p-4 flex items-center gap-3">
            <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm border', CAT_COLORS[cat])}>
              {cat === 'SKILL' ? '⚡' : cat === 'FITNESS' ? '💪' : cat === 'TEAMWORK' ? '🤝' : cat === 'DISCIPLINE' ? '📋' : '💬'}
            </div>
            <div>
              <p className="text-xs text-gray-500">{cat}</p>
              <p className="text-xl font-bold text-white">
                {(feedback ?? []).filter(f => f.category === cat).length}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Create Feedback Form */}
      {showForm && (
        <div className="bg-dark-800 border border-emerald-500/30 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <MessageSquare size={14} className="text-emerald-400" /> Create Player Feedback
          </h3>
          {saved && (
            <div className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-sm text-emerald-400">
              ✓ Feedback sent! Player can view it on their dashboard.
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Player <span className="text-red-400">*</span></label>
                <select {...register('playerId', { required: true })}
                  className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white appearance-none focus:outline-none focus:border-emerald-500">
                  <option value="">— Select Player —</option>
                  {(players ?? []).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-3 bottom-3 text-gray-500 pointer-events-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Category</label>
                  <select {...register('category')}
                    className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white appearance-none focus:outline-none focus:border-emerald-500">
                    {['SKILL','FITNESS','TEAMWORK','DISCIPLINE','GENERAL'].map(c => <option key={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 bottom-3 text-gray-500 pointer-events-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Date</label>
                  <input type="date" {...register('date')}
                    className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Feedback Title <span className="text-red-400">*</span></label>
              <select {...register('feedbackTitle', { required: true })}
                className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white appearance-none focus:outline-none focus:border-emerald-500">
                <option value="">— Choose or type below —</option>
                {REMARK_PRESETS.filter(Boolean).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-3 bottom-3 text-gray-500 pointer-events-none" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Detailed Remarks <span className="text-red-400">*</span></label>
              <textarea {...register('remarks', { required: true })} rows={4}
                placeholder="Write your coaching remarks for this player..."
                className="w-full bg-dark-900 border border-dark-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Quick presets */}
            <div>
              <p className="text-[10px] text-gray-500 mb-2">Quick remarks:</p>
              <div className="flex flex-wrap gap-2">
                {REMARK_PRESETS.filter(Boolean).map(r => (
                  <button type="button" key={r}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-dark-700 text-gray-400 hover:text-white hover:bg-dark-600 border border-dark-600 transition-colors">
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => { reset(); setShowForm(false); }}
                className="px-4 py-2.5 rounded-xl bg-dark-700 border border-dark-600 text-gray-400 hover:text-white text-sm transition-colors">
                Cancel
              </button>
              <button type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors">
                <Save size={14} /> Send Feedback
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <select value={filterPlayer} onChange={e => setFilterPlayer(e.target.value)}
            className="bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white appearance-none pr-8 focus:outline-none focus:border-emerald-500">
            <option value="ALL">All Players</option>
            {(players ?? []).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(c => (
            <button key={c} onClick={() => setFilterCat(c)}
              className={clsx(
                'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                filterCat === c
                  ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-400'
                  : 'bg-dark-800 border-dark-700 text-gray-400 hover:text-white',
              )}>{c}</button>
          ))}
        </div>
      </div>

      {/* Feedback List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-dark-800 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(f => (
            <div key={f.id} className="bg-dark-800 border border-dark-700 rounded-2xl p-5 hover:border-dark-600 transition-colors">
              <div className="flex items-start gap-3">
                <Avatar name={f.playerName} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-white">{f.playerName}</p>
                    <span className={clsx('text-[9px] font-bold px-2 py-0.5 rounded-full border', CAT_COLORS[f.category] ?? CAT_COLORS.GENERAL)}>
                      {f.category}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-emerald-400 mt-1">{f.feedbackTitle}</p>
                  <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{f.remarks}</p>
                  <div className="flex items-center gap-3 mt-2.5">
                    <span className="text-[10px] text-gray-600">{f.date}</span>
                    <span className="text-[10px] text-gray-600">· By {f.createdBy}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="lg:col-span-2 py-12 text-center">
              <MessageSquare size={32} className="mx-auto text-dark-600 mb-3" />
              <p className="text-gray-500">No feedback records found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
