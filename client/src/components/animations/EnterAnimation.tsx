import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface IEnterAnimationProps {
  children: ReactNode;
  opacity?: boolean;
  translateY?: boolean;
}

export default function EnterAnimation({
  children,
  opacity = true,
  translateY = true,
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

  return (
    <motion.div
      variants={animationVariants}
      initial='initial'
      whileInView='animate'
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      {children}
    </motion.div>
  );
}
