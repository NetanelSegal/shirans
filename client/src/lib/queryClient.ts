import { QueryClient } from '@tanstack/react-query';

/** Default stale time for public-facing queries (explicit per-query options match QueryClient defaults). */
export const QUERY_STALE_TIME_MS = 5 * 60 * 1000;
export const QUERY_GC_TIME_MS = 10 * 60 * 1000;

/** Admin list queries: fresher data than public caches. */
export const QUERY_STALE_TIME_ADMIN_MS = 60 * 1000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_TIME_MS,
      gcTime: QUERY_GC_TIME_MS,
    },
  },
});
