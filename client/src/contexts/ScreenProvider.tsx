import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface IScreenContext {
  screenWidth: number;
  isSmallScreen: boolean;
}

const ScreenContext = createContext<null | IScreenContext>(null);

export default function ScreenProvider({ children }: { children: ReactNode }) {
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  function handleResize() {
    setScreenWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <ScreenContext.Provider
      value={{ screenWidth, isSmallScreen: screenWidth < 768 }}
    >
      {children}
    </ScreenContext.Provider>
  );
}

export const useScreenContext = () => {
  const data = useContext(ScreenContext);
  if (!data)
    throw new Error('useScreenContext() must be used within a ScreenProvider');
  return data;
};
