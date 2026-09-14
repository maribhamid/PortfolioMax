import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ScrollProgressProps {
  className?: string;
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({ className }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className={cn(
        'fixed top-0 left-0 right-0 h-1 z-50 origin-left bg-gradient-to-r from-purple-500 via-cyan-400 to-emerald-400 shadow-[0_0_12px_rgba(139,92,246,0.6)]',
        className
      )}
    />
  );
};
