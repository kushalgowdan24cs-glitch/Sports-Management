import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'gray';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

const variantClasses = {
  primary: 'bg-primary-500/20 text-primary-300 border-primary-500/30',
  success: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  warning: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  danger:  'bg-red-500/20 text-red-300 border-red-500/30',
  info:    'bg-blue-500/20 text-blue-300 border-blue-500/30',
  purple:  'bg-violet-500/20 text-violet-300 border-violet-500/30',
  gray:    'bg-gray-500/20 text-gray-300 border-gray-500/30',
};

const dotColors = {
  primary: 'bg-primary-400',
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  danger:  'bg-red-400',
  info:    'bg-blue-400',
  purple:  'bg-violet-400',
  gray:    'bg-gray-400',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'sm',
  dot = false,
  className,
}) => {
  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 border font-medium rounded-full',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
      variantClasses[variant],
      className,
    )}>
      {dot && (
        <span className={clsx('w-1.5 h-1.5 rounded-full animate-pulse-slow', dotColors[variant])} />
      )}
      {children}
    </span>
  );
};

// Specific badge helpers
export const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
  const map: Record<string, BadgeProps['variant']> = {
    COACH: 'primary', CAPTAIN: 'success', PLAYER: 'gray',
    Raider: 'danger', Defender: 'info', 'All-Rounder': 'purple',
    Striker: 'warning', Goalkeeper: 'success', Batsman: 'info',
    Bowler: 'danger', 'Wicket-Keeper': 'purple', Other: 'gray',
  };
  return <Badge variant={map[role] ?? 'gray'}>{role}</Badge>;
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, BadgeProps['variant']> = {
    PRESENT: 'success', ABSENT: 'danger', LATE: 'warning', EXCUSED: 'info',
    WIN: 'success', LOSS: 'danger', DRAW: 'gray',
    SCHEDULED: 'info', IN_PROGRESS: 'warning', COMPLETED: 'success', CANCELLED: 'danger',
    ACTIVE: 'danger', RECOVERING: 'warning', RECOVERED: 'success', CRITICAL: 'danger',
    COLLEGE: 'gray', DISTRICT: 'info', STATE: 'warning', NATIONAL: 'success', INTERNATIONAL: 'primary',
  };
  return <Badge variant={map[status] ?? 'gray'} dot={['ACTIVE', 'IN_PROGRESS'].includes(status)}>{status.replace(/_/g, ' ')}</Badge>;
};
