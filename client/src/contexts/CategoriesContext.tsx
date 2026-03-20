import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  ReactNode,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/services/categories.service';
import { queryKeys } from '@/constants/queryKeys';
import { transformError } from '@/utils/errorHandler';
import { getClientErrorMessage } from '@/constants/errorMessages';

const FIVE_MIN = 5 * 60 * 1000;
const TEN_MIN = 10 * 60 * 1000;

interface CategoriesContextType {
  categoriesMap: Record<string, string>;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(
  undefined,
);

export const CategoriesProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.categories,
    queryFn: fetchCategories,
    staleTime: FIVE_MIN,
    gcTime: TEN_MIN,
  });

  const categoriesMap = useMemo(() => {
    const map: Record<string, string> = {};
    if (data) {
      for (const cat of data) {
        map[cat.urlCode] = cat.title;
      }
    }
    return map;
  }, [data]);

  const errorMessage = error
    ? getClientErrorMessage(transformError(error).errorKey)
    : null;

  const retry = useCallback(() => {
    void refetch();
  }, [refetch]);

  return (
    <CategoriesContext.Provider
      value={{ categoriesMap, isLoading, error: errorMessage, retry }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = (): CategoriesContextType => {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};
