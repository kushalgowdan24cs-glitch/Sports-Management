import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MessageSquare, ThumbsUp, AlertCircle, Info } from 'lucide-react';
import clsx from 'clsx';
import { playerDashboardService } from '@/services/player/playerDashboardService';
import type { CoachFeedbackItem } from '@/types/player.dashboard.types';

const categoryConfig = {
  PRAISE: {
    icon: <ThumbsUp size={14} className="text-emerald-400" />,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/8',
    border: 'border-emerald-500/25',
    label: 'Praise',
    dotColor: 'bg-emerald-500',
  },
  IMPROVEMENT: {
    icon: <AlertCircle size={14} className="text-amber-400" />,
    color: 'text-amber-400',
    bg: 'bg-amber-500/8',
    border: 'border-amber-500/25',
    label: 'Improvement',
    dotColor: 'bg-amber-500',
  },
  GENERAL: {
    icon: <Info size={14} className="text-blue-400" />,
    color: 'text-blue-400',
    bg: 'bg-blue-500/8',
    border: 'border-blue-500/25',
    label: 'General',
    dotColor: 'bg-blue-500',
  },
};

const FeedbackCard: React.FC<{ item: CoachFeedbackItem; isLatest?: boolean }> = ({ item, isLatest }) => {
  const cfg = categoryConfig[item.category];
  return (
    <div className={clsx(
      'rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5',
      cfg.bg, cfg.border,
      isLatest && 'ring-1 ring-emerald-500/30',
    )}>
      <div className="flex items-start gap-3">
        <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
          item.category === 'PRAISE' ? 'bg-emerald-500/20' :
          item.category === 'IMPROVEMENT' ? 'bg-amber-500/20' : 'bg-blue-500/20',
        )}>
          {cfg.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-sm font-bold text-white">{item.title}</h3>
            {isLatest && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Latest
              </span>
            )}
            <span className={clsx('px-2 py-0.5 rounded-full text-[10px] font-medium border ml-auto',
              item.category === 'PRAISE' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
              item.category === 'IMPROVEMENT' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
              'bg-blue-500/15 text-blue-400 border-blue-500/30',
            )}>
              {cfg.label}
            </span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">{item.remarks}</p>
          <div className="flex items-center justify-between text-[11px] text-gray-500">
            <span>— {item.coachName}</span>
            <span>{item.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeedbackPage: React.FC = () => {
  const { data: feedback, isLoading } = useQuery({
    queryKey: ['player-feedback'],
    queryFn: playerDashboardService.getFeedback,
  });
  const [filter, setFilter] = useState<'ALL' | 'PRAISE' | 'IMPROVEMENT' | 'GENERAL'>('ALL');

  const filtered = (feedback ?? []).filter(f => filter === 'ALL' || f.category === filter);
  const praises      = (feedback ?? []).filter(f => f.category === 'PRAISE').length;
  const improvements = (feedback ?? []).filter(f => f.category === 'IMPROVEMENT').length;
  const generals     = (feedback ?? []).filter(f => f.category === 'GENERAL').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Coach Feedback</h1>
        <p className="text-sm text-gray-400 mt-1">Personal recommendations and assessments from your coach</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Praise',      count: praises,      icon: '👍', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/25' },
          { label: 'Improvement', count: improvements, icon: '💡', color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/25' },
          { label: 'General',     count: generals,     icon: 'ℹ️', color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/25' },
        ].map(s => (
          <div key={s.label} className={clsx('rounded-2xl border p-4 text-center', s.bg)}>
            <span className="text-2xl">{s.icon}</span>
            <p className={clsx('text-2xl font-bold mt-1', s.color)}>{s.count}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['ALL', 'PRAISE', 'IMPROVEMENT', 'GENERAL'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              'px-4 py-1.5 rounded-xl text-xs font-semibold transition-all border',
              filter === f
                ? f === 'PRAISE'      ? 'bg-emerald-600 text-white border-emerald-500'
                : f === 'IMPROVEMENT' ? 'bg-amber-600 text-white border-amber-500'
                : f === 'GENERAL'     ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-primary-600 text-white border-primary-500'
                : 'bg-dark-800 text-gray-400 border-dark-700 hover:text-white',
            )}
          >
            {f === 'ALL' ? `All (${feedback?.length ?? 0})` :
             f === 'PRAISE' ? `Praise (${praises})` :
             f === 'IMPROVEMENT' ? `Improvement (${improvements})` :
             `General (${generals})`}
          </button>
        ))}
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-dark-800 border border-dark-700 rounded-2xl animate-pulse" />
            ))
          : filtered.map((item, idx) => (
              <FeedbackCard key={item.id} item={item} isLatest={idx === 0 && filter === 'ALL'} />
            ))
        }
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
            <p>No feedback in this category</p>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-dark-800 border border-dark-700 text-xs text-gray-500">
        <Info size={12} className="shrink-0 text-gray-600" />
        Feedback is provided by your coach and is read-only. Contact your coach for queries.
      </div>
    </div>
  );
};

export default FeedbackPage;
