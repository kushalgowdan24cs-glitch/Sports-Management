import React from 'react';
import clsx from 'clsx';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
  iconBg?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumb,
  actions,
  icon,
  iconBg = 'bg-primary-500/20',
}) => {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        {icon && (
          <div className={clsx(
            'w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0',
            iconBg,
          )}>
            {icon}
          </div>
        )}
        <div>
          {breadcrumb && breadcrumb.length > 0 && (
            <nav className="flex items-center gap-1 mb-1">
              {breadcrumb.map((crumb, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className="text-gray-600 text-xs">/</span>}
                  <span className={clsx(
                    'text-xs',
                    i === breadcrumb.length - 1 ? 'text-gray-400' : 'text-gray-500',
                  )}>
                    {crumb.label}
                  </span>
                </React.Fragment>
              ))}
            </nav>
          )}
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
};
