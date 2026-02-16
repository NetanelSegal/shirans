import { motion } from 'motion/react';
import { ReactNode, useSyncExternalStore } from 'react';

interface CommonProps {
  children: ReactNode;
  opacity?: boolean;
  translateY?: boolean;
  duration?: number;

  delay?: number;
}

interface AnimateWhileInViewProps {
  dontAnimateWhileInView?: never;
  runAnimation?: never;
  once?: boolean;
}

interface NotAnimateWhileInViewProps {
  dontAnimateWhileInView?: boolean;
  runAnimation?: boolean;
  once?: never;
}

type IEnterAnimationProps = CommonProps &
  (AnimateWhileInViewProps | NotAnimateWhileInViewProps);

const mediaQuery =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

function subscribe(cb: () => void) {
  mediaQuery?.addEventListener('change', cb);
  return () => mediaQuery?.removeEventListener('change', cb);
}

function getSnapshot() {
  return mediaQuery?.matches ?? false;
}

function getServerSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default function EnterAnimation({
  children,
  opacity = true,
  translateY = true,
  duration = 1,
  once = true,
  delay = 0,
  runAnimation,
  dontAnimateWhileInView,
}: IEnterAnimationProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <div style={{ width: '100%' }}>{children}</div>;
  }

  const animationVariants = {
    initial: {
      opacity: opacity ? 0 : undefined,
      y: translateY ? 200 : undefined,
    },
    animate: {
      opacity: opacity ? 1 : undefined,
      y: translateY ? 0 : undefined,
    },
  };

  return (
    <motion.div
      variants={animationVariants}
      initial='initial'
      style={{ width: '100%' }}
      {...(dontAnimateWhileInView
        ? { animate: runAnimation ? 'animate' : 'initial' }
        : { whileInView: 'animate', viewport: { once } })}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
}
