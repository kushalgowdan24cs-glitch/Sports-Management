import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import clsx from 'clsx';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  // Pagination
  page?: number;
  totalPages?: number;
  totalElements?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  // Actions
  actions?: (row: T) => React.ReactNode;
  onRowClick?: (row: T) => void;
}

export const DataTable = <T,>({
  columns,
  data,
  keyField,
  isLoading,
  emptyMessage = 'No records found.',
  emptyIcon,
  page = 0,
  totalPages = 1,
  totalElements,
  pageSize = 10,
  onPageChange,
  actions,
  onRowClick,
}: DataTableProps<T>) => {
  const startRecord = page * pageSize + 1;
  const endRecord = Math.min((page + 1) * pageSize, totalElements ?? data.length);

  return (
    <div className="flex flex-col gap-0">
      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-dark-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-700 bg-dark-800/50">
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  className={clsx(
                    'px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap',
                    col.className,
                  )}
                >
                  {col.header}
                </th>
              ))}
              {actions && (
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-dark-700/50 animate-pulse">
                  {columns.map((col, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-dark-700 rounded" />
                    </td>
                  ))}
                  {actions && <td className="px-4 py-3"><div className="h-4 bg-dark-700 rounded" /></td>}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-gray-500">
                    {emptyIcon && <div className="text-4xl opacity-30">{emptyIcon}</div>}
                    <p className="text-sm">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={String(row[keyField])}
                  className={clsx(
                    'border-b border-dark-700/50 transition-colors duration-150',
                    'hover:bg-white/[0.02]',
                    onRowClick && 'cursor-pointer',
                    rowIdx % 2 === 0 ? 'bg-dark-900' : 'bg-dark-800/30',
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map(col => (
                    <td
                      key={String(col.key)}
                      className={clsx('px-4 py-3 text-gray-200', col.className)}
                    >
                      {col.render
                        ? col.render(row, rowIdx)
                        : String((row as Record<string, unknown>)[String(col.key)] ?? '—')}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {onPageChange && totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-3 mt-2">
          <p className="text-xs text-gray-500">
            Showing {startRecord}–{endRecord} of {totalElements ?? data.length}
          </p>
          <div className="flex items-center gap-1">
            <PageButton onClick={() => onPageChange(0)} disabled={page === 0} title="First page">
              <ChevronsLeft size={14} />
            </PageButton>
            <PageButton onClick={() => onPageChange(page - 1)} disabled={page === 0} title="Previous page">
              <ChevronLeft size={14} />
            </PageButton>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const p = Math.max(0, Math.min(page - 2, totalPages - 5)) + i;
              return (
                <PageButton
                  key={p}
                  onClick={() => onPageChange(p)}
                  active={p === page}
                  title={`Page ${p + 1}`}
                >
                  {p + 1}
                </PageButton>
              );
            })}
            <PageButton onClick={() => onPageChange(page + 1)} disabled={page >= totalPages - 1} title="Next page">
              <ChevronRight size={14} />
            </PageButton>
            <PageButton onClick={() => onPageChange(totalPages - 1)} disabled={page >= totalPages - 1} title="Last page">
              <ChevronsRight size={14} />
            </PageButton>
          </div>
        </div>
      )}
    </div>
  );
};

const PageButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  title?: string;
}> = ({ children, onClick, disabled, active, title }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={clsx(
      'w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors',
      active
        ? 'bg-primary-600 text-white'
        : 'text-gray-400 hover:bg-white/10 hover:text-white',
      disabled && 'opacity-30 cursor-not-allowed',
    )}
  >
    {children}
  </button>
);
