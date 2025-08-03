import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
  // Add default queryFn to handle the console errors
  queryCache: undefined,
  mutationCache: undefined,
});

// Default query function for React Query
queryClient.setDefaultOptions({
  queries: {
    queryFn: async ({ queryKey, signal }) => {
      const url = Array.isArray(queryKey) ? queryKey[0] : queryKey;

      if (typeof url !== 'string') {
        throw new Error('Query key must be a string or array with string as first element');
      }

      const response = await fetch(url, { signal });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    },
  },
});