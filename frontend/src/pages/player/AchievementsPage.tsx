import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Award, Medal, X, ExternalLink } from 'lucide-react';
import clsx from 'clsx';
import { playerDashboardService } from '@/services/player/playerDashboardService';
import type { PlayerAchievement, AchievementLevel } from '@/types/player.dashboard.types';

const levelConfig: Record<AchievementLevel, { color: string; bg: string; border: string; glow: string }> = {
  COLLEGE:       { color: 'text-gray-300',    bg: 'bg-gray-500/15',     border: 'border-gray-500/30',     glow: '' },
  DISTRICT:      { color: 'text-blue-300',    bg: 'bg-blue-500/15',     border: 'border-blue-500/30',     glow: '' },
  STATE:         { color: 'text-emerald-300', bg: 'bg-emerald-500/15',  border: 'border-emerald-500/30',  glow: '' },
  NATIONAL:      { color: 'text-primary-300', bg: 'bg-primary-500/15',  border: 'border-primary-500/30',  glow: 'shadow-glow-primary' },
  INTERNATIONAL: { color: 'text-amber-300',   bg: 'bg-amber-500/15',    border: 'border-amber-500/30',    glow: '' },
};

const medalEmoji: Record<string, string> = {
  GOLD: '🥇', SILVER: '🥈', BRONZE: '🥉', CERTIFICATE: '📜',
};

const AchievementsPage: React.FC = () => {
  const { data: achievements, isLoading } = useQuery({
    queryKey: ['player-achievements'],
    queryFn: playerDashboardService.getAchievements,
  });

  const [selected, setSelected] = useState<PlayerAchievement | null>(null);
  const [levelFilter, setLevelFilter] = useState<AchievementLevel | 'ALL'>('ALL');

  const filtered = (achievements ?? []).filter(a => levelFilter === 'ALL' || a.level === levelFilter);

  const levelCounts: Record<string, number> = (achievements ?? []).reduce((acc, a) => {
    acc[a.level] = (acc[a.level] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Achievements</h1>
        <p className="text-sm text-gray-400 mt-1">Your milestone accomplishments and awards</p>
      </div>

      {/* Summary Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(['ALL', 'NATIONAL', 'STATE', 'DISTRICT', 'COLLEGE'] as const).map(level => {
          const count = level === 'ALL' ? (achievements?.length ?? 0) : (levelCounts[level] ?? 0);
          const cfg = level !== 'ALL' ? levelConfig[level] : { color: 'text-white', bg: 'bg-dark-700/50', border: 'border-dark-700', glow: '' };
          return (
            <button
              key={level}
              onClick={() => setLevelFilter(level as AchievementLevel | 'ALL')}
              className={clsx(
                'p-4 rounded-2xl border text-center transition-all',
                levelFilter === level ? `${cfg.bg} ${cfg.border} ${cfg.glow}` : 'bg-dark-800 border-dark-700',
              )}
            >
              <p className={clsx('text-2xl font-bold', cfg.color)}>{count}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{level === 'ALL' ? 'Total' : level}</p>
            </button>
          );
        })}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 bg-dark-800 border border-dark-700 rounded-2xl animate-pulse" />
            ))
          : filtered.map(a => {
              const cfg = levelConfig[a.level];
              return (
                <div
                  key={a.id}
                  onClick={() => setSelected(a)}
                  className={clsx(
                    'bg-dark-800 rounded-2xl border p-5 cursor-pointer transition-all duration-300',
                    'hover:-translate-y-1 hover:shadow-lg',
                    cfg.border, cfg.glow,
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-4xl">{medalEmoji[a.medalType]}</span>
                    <span className={clsx('text-[10px] font-semibold px-2 py-1 rounded-full border', cfg.bg, cfg.border, cfg.color)}>
                      {a.level}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{a.title}</h3>
                  <p className="text-xs text-gray-400 mb-2">{a.eventName}</p>
                  <p className="text-[11px] text-gray-600">{a.date}</p>
                  {a.certificateUrl && (
                    <div className="mt-3 flex items-center gap-1 text-[11px] text-primary-400">
                      <ExternalLink size={10} /> View Certificate
                    </div>
                  )}
                </div>
              );
            })
        }
        {!isLoading && filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            <Trophy size={32} className="mx-auto mb-3 opacity-30" />
            <p>No achievements in this category</p>
          </div>
        )}
      </div>

      {/* Achievement Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="w-full max-w-md bg-dark-800 border border-dark-700 rounded-3xl shadow-2xl animate-slide-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-dark-700">
              <h3 className="text-base font-bold text-white">Achievement Detail</h3>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>
            {/* Modal Body */}
            <div className="p-6">
              <div className="text-center mb-6">
                <span className="text-6xl">{medalEmoji[selected.medalType]}</span>
                <h2 className="text-xl font-bold text-white mt-3">{selected.title}</h2>
                <p className="text-sm text-gray-400 mt-1">{selected.eventName}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-dark-900/60 border border-dark-700">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Level</p>
                  <p className={clsx('text-sm font-bold mt-1', levelConfig[selected.level].color)}>{selected.level}</p>
                </div>
                <div className="p-3 rounded-xl bg-dark-900/60 border border-dark-700">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Medal</p>
                  <p className="text-sm font-bold text-white mt-1">{selected.medalType}</p>
                </div>
                <div className="p-3 rounded-xl bg-dark-900/60 border border-dark-700 col-span-2">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Date</p>
                  <p className="text-sm font-medium text-white mt-1">{selected.date}</p>
                </div>
              </div>
              {selected.description && (
                <div className="p-4 rounded-xl bg-dark-900/60 border border-dark-700">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Description</p>
                  <p className="text-sm text-gray-300">{selected.description}</p>
                </div>
              )}
              {selected.certificateUrl && (
                <a
                  href={selected.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold transition-colors"
                >
                  <Award size={14} /> View Certificate
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementsPage;
