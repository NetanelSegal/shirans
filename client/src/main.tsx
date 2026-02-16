import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionGlobalConfig } from 'motion/react';
import './index.css';
import App from './App.tsx';

MotionGlobalConfig.skipAnimations =
  import.meta.env.VITE_SKIP_ANIMATIONS === 'true' ||
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Debug: expose env values for E2E verification (remove after debugging)
document.documentElement.dataset.viteSkipAnimations =
  import.meta.env.VITE_SKIP_ANIMATIONS ?? 'undefined';
document.documentElement.dataset.motionSkipAnimations = String(
  MotionGlobalConfig.skipAnimations,
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
