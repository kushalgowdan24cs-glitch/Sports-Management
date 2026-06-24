import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, Calendar, User, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import clsx from 'clsx';
import { playerDashboardService } from '@/services/player/playerDashboardService';
import type { PlayerInjuryRecord, RecoveryStatus } from '@/types/player.dashboard.types';

const statusConfig: Record<RecoveryStatus, { color: string; bg: string; border: string; icon: React.ReactNode; label: string }> = {
  RECOVERED:  { color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', icon: <CheckCircle size={13} className="text-emerald-400" />, label: 'Recovered' },
  RECOVERING: { color: 'text-amber-400',   bg: 'bg-amber-500/15',   border: 'border-amber-500/30',   icon: <Clock size={13} className="text-amber-400" />,         label: 'Recovering' },
  ACTIVE:     { color: 'text-red-400',     bg: 'bg-red-500/15',     border: 'border-red-500/30',     icon: <AlertCircle size={13} className="text-red-400" />,     label: 'Active' },
  CRITICAL:   { color: 'text-red-400',     bg: 'bg-red-500/20',     border: 'border-red-500/40',     icon: <AlertCircle size={13} className="text-red-400" />,     label: 'Critical' },
};

const RecoveryProgressBar: React.FC<{ progress: number; status: RecoveryStatus }> = ({ progress, status }) => {
  const color =
    status === 'RECOVERED' ? 'from-emerald-500 to-teal-400' :
    status === 'RECOVERING' ? 'from-amber-500 to-yellow-400' :
    'from-red-500 to-red-400';

  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-gray-500">Recovery Progress</span>
        <span className="font-semibold text-white">{progress}%</span>
      </div>
      <div className="h-2.5 bg-dark-700 rounded-full overflow-hidden">
        <div
          className={clsx('h-full bg-gradient-to-r rounded-full transition-all duration-700', color)}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

const InjuryCard: React.FC<{ injury: PlayerInjuryRecord }> = ({ injury }) => {
  const cfg = statusConfig[injury.recoveryStatus];
  return (
    <div className={clsx('bg-dark-800 rounded-2xl border p-5 transition-all hover:-translate-y-0.5', cfg.border)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', cfg.bg)}>
            <Activity size={16} className={cfg.color} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{injury.injuryType}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              {cfg.icon}
              <span className={clsx('text-xs font-medium', cfg.color)}>{cfg.label}</span>
            </div>
          </div>
        </div>
        <span className={clsx('px-2.5 py-1 rounded-full text-[10px] font-bold border', cfg.bg, cfg.border, cfg.color)}>
          {injury.recoveryProgress}%
        </span>
      </div>

      <RecoveryProgressBar progress={injury.recoveryProgress} status={injury.recoveryStatus} />

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="p-2.5 rounded-xl bg-dark-900/60 border border-dark-700/50">
          <div className="flex items-center gap-1.5 mb-1">
            <Calendar size={10} className="text-gray-500" />
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Injury Date</p>
          </div>
          <p className="text-xs font-medium text-white">{injury.injuryDate}</p>
        </div>
        {injury.expectedReturnDate && (
          <div className="p-2.5 rounded-xl bg-dark-900/60 border border-dark-700/50">
            <div className="flex items-center gap-1.5 mb-1">
              <CheckCircle size={10} className="text-gray-500" />
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Expected Return</p>
            </div>
            <p className="text-xs font-medium text-white">{injury.expectedReturnDate}</p>
          </div>
        )}
        {injury.treatedBy && (
          <div className="p-2.5 rounded-xl bg-dark-900/60 border border-dark-700/50 col-span-2">
            <div className="flex items-center gap-1.5 mb-1">
              <User size={10} className="text-gray-500" />
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Treated By</p>
            </div>
            <p className="text-xs font-medium text-white">{injury.treatedBy}</p>
          </div>
        )}
      </div>

      {injury.notes && (
        <div className="mt-3 p-3 rounded-xl bg-dark-900/60 border border-dark-700/50">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Notes</p>
          <p className="text-xs text-gray-300">{injury.notes}</p>
        </div>
      )}
    </div>
  );
};

const InjuriesPage: React.FC = () => {
  const { data: injuries, isLoading } = useQuery({
    queryKey: ['player-injuries'],
    queryFn: playerDashboardService.getInjuries,
  });

  const active    = (injuries ?? []).filter(i => ['ACTIVE', 'CRITICAL'].includes(i.recoveryStatus)).length;
  const recovering= (injuries ?? []).filter(i => i.recoveryStatus === 'RECOVERING').length;
  const recovered = (injuries ?? []).filter(i => i.recoveryStatus === 'RECOVERED').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Injury Records</h1>
        <p className="text-sm text-gray-400 mt-1">Your injury history and recovery tracking</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active',     count: active,     color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/25',         icon: '🚨' },
          { label: 'Recovering', count: recovering, color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/25',     icon: '🔄' },
          { label: 'Recovered',  count: recovered,  color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/25', icon: '✅' },
        ].map(s => (
          <div key={s.label} className={clsx('rounded-2xl border p-4 text-center', s.bg)}>
            <span className="text-2xl">{s.icon}</span>
            <p className={clsx('text-2xl font-bold mt-1', s.color)}>{s.count}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Healthy Banner if no active injuries */}
      {!isLoading && active === 0 && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25">
          <span className="text-2xl">💪</span>
          <div>
            <p className="text-sm font-semibold text-emerald-300">You're Fit & Healthy!</p>
            <p className="text-xs text-gray-400">No active injuries. Keep up the great work!</p>
          </div>
        </div>
      )}

      {/* Injury Cards */}
      <div className="space-y-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-52 bg-dark-800 border border-dark-700 rounded-2xl animate-pulse" />
            ))
          : (injuries ?? []).map(injury => <InjuryCard key={injury.id} injury={injury} />)
        }
        {!isLoading && injuries?.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Activity size={32} className="mx-auto mb-3 opacity-30" />
            <p>No injury records found</p>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-dark-800 border border-dark-700 text-xs text-gray-500">
        <AlertCircle size={12} className="shrink-0 text-gray-600" />
        Injury records are managed by the coaching staff. Contact your coach or physiotherapist for updates.
      </div>
    </div>
  );
};

export default InjuriesPage;
