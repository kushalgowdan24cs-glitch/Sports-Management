import React from 'react';
import clsx from 'clsx';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
  label?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'text-primary-500',
  className,
  label,
}) => (
  <div className={clsx('flex flex-col items-center justify-center gap-3', className)}>
    <svg
      className={clsx('animate-spin', sizeClasses[size], color)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
    {label && <p className="text-sm text-gray-400 animate-pulse">{label}</p>}
  </div>
);

export const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <Spinner size="lg" label="Loading..." />
  </div>
);
