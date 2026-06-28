import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, CheckCircle, AlertTriangle, Calendar, User, TrendingUp } from 'lucide-react';
import { vcDashboardService } from '@/services/vice-captain/vcDashboardService';
import type { VCInjury } from '@/types/vice-captain.types';
import { Avatar } from '@/components/common/Avatar';
import clsx from 'clsx';

const severityColors: Record<string, string> = {
  MILD:     'bg-amber-500/10 text-amber-400 border-amber-500/25',
  MODERATE: 'bg-orange-500/10 text-orange-400 border-orange-500/25',
  SEVERE:   'bg-red-500/10 text-red-400 border-red-500/25',
};

const recoveryColors: Record<string, string> = {
  ACTIVE:     'text-red-400',
  RECOVERING: 'text-amber-400',
  RECOVERED:  'text-emerald-400',
};

const InjuriesPage: React.FC = () => {
  const { data: injuries = [], isLoading } = useQuery({ queryKey: ['vc-injuries'], queryFn: vcDashboardService.getInjuries });
  const [filter, setFilter] = useState<string>('ALL');

  const active    = injuries.filter(i => i.recoveryStatus === 'ACTIVE');
  const recovering = injuries.filter(i => i.recoveryStatus === 'RECOVERING');
  const recovered = injuries.filter(i => i.recoveryStatus === 'RECOVERED');

  const filtered = filter === 'ALL' ? injuries : injuries.filter(i => i.recoveryStatus === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Injury Monitoring</h1>
        <p className="text-sm text-gray-400 mt-1">Track and monitor player injuries and recovery progress</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Active Injuries',     value: active.length,     icon: <AlertTriangle size={18} />, color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/20' },
          { label: 'In Recovery',         value: recovering.length, icon: <Activity size={18} />,      color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20' },
          { label: 'Cleared / Recovered', value: recovered.length,  icon: <CheckCircle size={18} />,   color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        ].map(s => (
          <div key={s.label} className={clsx('bg-dark-800 border rounded-2xl p-5 flex items-center gap-4', s.border)}>
            <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', s.bg, s.color)}>
              {s.icon}
            </div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className={clsx('text-2xl font-bold', s.color)}>{isLoading ? '—' : s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Banner for active injuries */}
      {active.length > 0 && (
        <div className="flex items-start gap-3 px-4 py-3.5 bg-red-500/10 border border-red-500/25 rounded-xl">
          <AlertTriangle size={15} className="text-red-400 shrink-0 mt-0.5" />
          <p className="text-xs text-red-300">
            <span className="font-semibold">{active.length} player(s) with active injuries.</span> These players should NOT participate in practice or matches until cleared by the physio.
          </p>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'ALL',        label: `All (${injuries.length})` },
          { key: 'ACTIVE',     label: `Active (${active.length})` },
          { key: 'RECOVERING', label: `Recovering (${recovering.length})` },
          { key: 'RECOVERED',  label: `Recovered (${recovered.length})` },
        ].map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            className={clsx(
              'px-4 py-2 rounded-xl text-xs font-medium transition-all',
              filter === t.key
                ? 'bg-violet-600 text-white shadow-glow-primary'
                : 'bg-dark-800 border border-dark-700 text-gray-400 hover:text-white hover:border-violet-500/30',
            )}>{t.label}</button>
        ))}
      </div>

      {/* Injury Cards */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-36 bg-dark-800 border border-dark-700 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(injury => (
            <InjuryCard key={injury.id} injury={injury} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 bg-dark-800 border border-dark-700 rounded-2xl">
              <CheckCircle size={32} className="text-emerald-500 mx-auto mb-3" />
              <p className="text-sm text-gray-300 font-medium">No injuries in this category</p>
              <p className="text-xs text-gray-500 mt-1">All players are healthy and cleared for play</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const InjuryCard: React.FC<{ injury: VCInjury }> = ({ injury }) => {
  const statusCfg = {
    ACTIVE:     { bar: 'bg-red-500',    text: 'text-red-400' },
    RECOVERING: { bar: 'bg-amber-500',  text: 'text-amber-400' },
    RECOVERED:  { bar: 'bg-emerald-500', text: 'text-emerald-400' },
  };
  const cfg = statusCfg[injury.recoveryStatus];

  return (
    <div className={clsx(
      'bg-dark-800 border rounded-2xl p-5 transition-all',
      injury.recoveryStatus === 'ACTIVE' ? 'border-red-500/25 hover:border-red-500/40' :
      injury.recoveryStatus === 'RECOVERING' ? 'border-amber-500/20 hover:border-amber-500/35' :
      'border-dark-700 hover:border-dark-600',
    )}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Avatar name={injury.playerName} size="md" />
          <div>
            <p className="text-sm font-bold text-white">{injury.playerName}</p>
            <p className={clsx('text-xs font-medium mt-0.5', recoveryColors[injury.recoveryStatus])}>
              {injury.recoveryStatus === 'ACTIVE' ? '🔴 Active Injury' :
               injury.recoveryStatus === 'RECOVERING' ? '🟡 In Recovery' : '🟢 Recovered'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={clsx('text-[10px] font-bold px-2.5 py-1 rounded-full border', severityColors[injury.severity])}>
            {injury.severity}
          </span>
          <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
            {injury.injuryType}
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5 flex items-center gap-1"><Calendar size={9} /> Injury Date</p>
          <p className="text-gray-300">{injury.injuryDate}</p>
        </div>
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5 flex items-center gap-1"><Calendar size={9} /> Expected Return</p>
          <p className="text-gray-300">{injury.expectedReturnDate}</p>
        </div>
        {injury.treatedBy && (
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5 flex items-center gap-1"><User size={9} /> Treated By</p>
            <p className="text-gray-300">{injury.treatedBy}</p>
          </div>
        )}
      </div>

      {/* Recovery progress */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-gray-500 flex items-center gap-1"><TrendingUp size={10} /> Recovery Progress</span>
          <span className={clsx('font-bold', cfg.text)}>{injury.recoveryProgress}%</span>
        </div>
        <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
          <div className={clsx('h-full rounded-full transition-all duration-700', cfg.bar)}
            style={{ width: `${injury.recoveryProgress}%` }} />
        </div>
      </div>

      {injury.notes && (
        <div className="mt-3 px-3 py-2 bg-dark-900/60 rounded-xl border border-dark-700/50">
          <p className="text-[11px] text-gray-400">{injury.notes}</p>
        </div>
      )}
    </div>
  );
};

export default InjuriesPage;
