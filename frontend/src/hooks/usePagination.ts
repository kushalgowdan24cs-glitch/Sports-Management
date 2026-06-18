import { useState, useCallback } from 'react';
import { ITEMS_PER_PAGE } from '@/utils/constants';

interface PaginationState {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export const usePagination = (initialSize = ITEMS_PER_PAGE) => {
  const [pagination, setPagination] = useState<PaginationState>({
    page: 0,
    size: initialSize,
    totalElements: 0,
    totalPages: 0,
  });

  const setPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const setSize = useCallback((size: number) => {
    setPagination(prev => ({ ...prev, size, page: 0 }));
  }, []);

  const updateTotals = useCallback((totalElements: number, totalPages: number) => {
    setPagination(prev => ({ ...prev, totalElements, totalPages }));
  }, []);

  const nextPage = useCallback(() => {
    setPagination(prev => ({
      ...prev,
      page: Math.min(prev.page + 1, prev.totalPages - 1),
    }));
  }, []);

  const prevPage = useCallback(() => {
    setPagination(prev => ({
      ...prev,
      page: Math.max(prev.page - 1, 0),
    }));
  }, []);

  const reset = useCallback(() => {
    setPagination(prev => ({ ...prev, page: 0 }));
  }, []);

  return {
    ...pagination,
    setPage,
    setSize,
    updateTotals,
    nextPage,
    prevPage,
    reset,
    canGoNext: pagination.page < pagination.totalPages - 1,
    canGoPrev: pagination.page > 0,
  };
};
