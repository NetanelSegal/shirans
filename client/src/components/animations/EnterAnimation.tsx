import { motion } from 'framer-motion';
import { ReactNode } from 'react';

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

  console.log('runAnimation', runAnimation);

  return (
    <motion.div
      variants={animationVariants}
      initial='initial'
      {...(dontAnimateWhileInView
        ? { animate: runAnimation ? 'animate' : 'initial' }
        : { whileInView: 'animate', viewport: { once } })}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
}
