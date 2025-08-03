import { useState, useCallback } from 'react';

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationControls {
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setLimit: (limit: number) => void;
  setTotal: (total: number) => void;
  reset: () => void;
}

export function usePagination(initialLimit: number = 50): [PaginationState, PaginationControls] {
  const [state, setState] = useState<PaginationState>({
    page: 1,
    limit: initialLimit,
    total: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const updateState = useCallback((updates: Partial<PaginationState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      const totalPages = Math.ceil(newState.total / newState.limit);
      
      return {
        ...newState,
        hasNextPage: newState.page < totalPages,
        hasPreviousPage: newState.page > 1,
      };
    });
  }, []);

  const goToPage = useCallback((page: number) => {
    if (page >= 1) {
      updateState({ page });
    }
  }, [updateState]);

  const nextPage = useCallback(() => {
    if (state.hasNextPage) {
      updateState({ page: state.page + 1 });
    }
  }, [state.hasNextPage, state.page, updateState]);

  const previousPage = useCallback(() => {
    if (state.hasPreviousPage) {
      updateState({ page: state.page - 1 });
    }
  }, [state.hasPreviousPage, state.page, updateState]);

  const setLimit = useCallback((limit: number) => {
    updateState({ limit, page: 1 }); // Reset to page 1 when changing limit
  }, [updateState]);

  const setTotal = useCallback((total: number) => {
    updateState({ total });
  }, [updateState]);

  const reset = useCallback(() => {
    setState({
      page: 1,
      limit: initialLimit,
      total: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    });
  }, [initialLimit]);

  return [
    state,
    {
      goToPage,
      nextPage,
      previousPage,
      setLimit,
      setTotal,
      reset,
    },
  ];
}