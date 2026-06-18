import React from 'react';
import clsx from 'clsx';
import { getInitials, generateAvatarColor } from '@/utils/formatUtils';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showOnline?: boolean;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

export const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md', className, showOnline }) => {
  const [imgError, setImgError] = React.useState(false);
  const colorClass = generateAvatarColor(name);

  return (
    <div className="relative inline-block">
      <div className={clsx(
        'rounded-full flex items-center justify-center overflow-hidden ring-2 ring-dark-700',
        sizeClasses[size],
        !src || imgError ? colorClass : '',
        className,
      )}>
        {src && !imgError ? (
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="font-semibold text-white">{getInitials(name)}</span>
        )}
      </div>
      {showOnline && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-dark-900" />
      )}
    </div>
  );
};
