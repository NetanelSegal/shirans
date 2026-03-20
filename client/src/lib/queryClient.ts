import { QueryClient } from '@tanstack/react-query';

const FIVE_MIN = 5 * 60 * 1000;
const TEN_MIN = 10 * 60 * 1000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: FIVE_MIN,
      gcTime: TEN_MIN,
    },
  },
});
