import { QueryClient } from '@tanstack/react-query';

const DEFAULT_STALE_TIME_MS = 5 * 60 * 1000;
const DEFAULT_GC_TIME_MS = 10 * 60 * 1000;

/** Admin list queries: fresher data than public caches. */
export const QUERY_STALE_TIME_ADMIN_MS = 60 * 1000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: DEFAULT_STALE_TIME_MS,
      gcTime: DEFAULT_GC_TIME_MS,
    },
  },
});
