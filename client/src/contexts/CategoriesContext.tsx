import { createContext, useContext, useMemo, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '@/services/categories.service';
import { queryKeys } from '@/constants/queryKeys';

const FIVE_MIN = 5 * 60 * 1000;
const TEN_MIN = 10 * 60 * 1000;

interface CategoriesContextType {
  categoriesMap: Record<string, string>;
  isLoading: boolean;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(
  undefined,
);

export const CategoriesProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading } = useQuery({
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

  return (
    <CategoriesContext.Provider value={{ categoriesMap, isLoading }}>
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
