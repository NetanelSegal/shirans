import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchCategories } from '@/services/categories.service';

interface CategoriesContextType {
  categoriesMap: Record<string, string>;
  isLoading: boolean;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(
  undefined,
);

export const CategoriesProvider = ({ children }: { children: ReactNode }) => {
  const [categoriesMap, setCategoriesMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then((data) => {
        const map: Record<string, string> = {};
        for (const cat of data) {
          map[cat.urlCode] = cat.title;
        }
        setCategoriesMap(map);
      })
      .catch(() => {
        // Silently fail - categories will just show empty labels
      })
      .finally(() => setIsLoading(false));
  }, []);

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
