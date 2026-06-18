import React from 'react';
import clsx from 'clsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg?: string;
  trend?: number;
  trendLabel?: string;
  subtitle?: string;
  gradient?: string;
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  iconBg = 'bg-primary-500/20',
  trend,
  trendLabel,
  subtitle,
  gradient,
  className,
  onClick,
}) => {
  const trendPositive = trend !== undefined && trend > 0;
  const trendNegative = trend !== undefined && trend < 0;

  return (
    <div
      className={clsx(
        'relative bg-dark-800 border border-dark-700 rounded-2xl p-5',
        'transition-all duration-300 hover:border-dark-700/80 hover:shadow-card-hover hover:-translate-y-0.5',
        onClick && 'cursor-pointer',
        className,
      )}
      onClick={onClick}
    >
      {/* Gradient accent */}
      {gradient && (
        <div className={clsx('absolute inset-0 rounded-2xl opacity-5', gradient)} />
      )}

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">{title}</p>
          <p className="text-3xl font-bold text-white mb-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          {trend !== undefined && (
            <div className={clsx(
              'flex items-center gap-1 mt-2 text-xs font-medium',
              trendPositive ? 'text-emerald-400' : trendNegative ? 'text-red-400' : 'text-gray-400',
            )}>
              {trendPositive ? <TrendingUp size={12} /> : trendNegative ? <TrendingDown size={12} /> : <Minus size={12} />}
              <span>{Math.abs(trend)}% {trendLabel || 'vs last month'}</span>
            </div>
          )}
        </div>
        <div className={clsx(
          'flex items-center justify-center w-12 h-12 rounded-xl text-white',
          iconBg,
        )}>
          {icon}
        </div>
      </div>
    </div>
  );
};
