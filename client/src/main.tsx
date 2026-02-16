import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionGlobalConfig } from 'motion/react';
import './index.css';
import App from './App.tsx';

MotionGlobalConfig.skipAnimations =
  import.meta.env.VITE_SKIP_ANIMATIONS === 'true' ||
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
