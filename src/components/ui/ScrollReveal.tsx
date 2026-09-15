import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}) => {
  const { data } = usePortfolio();
  const config = data.settings.effectsConfig?.scrollAnimations;
  const shouldReduceMotion = useReducedMotion();

  const isEnabled = !shouldReduceMotion && (config?.enabled ?? true);
  const intensity = config?.intensity || 'standard';

  if (!isEnabled) {
    return <div className={className}>{children}</div>;
  }

  const offset = intensity === 'subtle' ? 14 : intensity === 'energetic' ? 42 : 26;

  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: offset, x: 0 };
      case 'down':
        return { y: -offset, x: 0 };
      case 'left':
        return { x: offset, y: 0 };
      case 'right':
        return { x: -offset, y: 0 };
      default:
        return { x: 0, y: 0 };
    }
  };

  const pos = getInitialPosition();

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const viewportMargin = isMobile ? '80px' : '-20px';

  // Subtle Preset (Smooth minimal glide)
  if (intensity === 'subtle') {
    return (
      <motion.div
        initial={{ opacity: 0, ...pos }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, margin: viewportMargin }}
        transition={{ duration: 0.45, delay, ease: [0.25, 0.1, 0.25, 1] }}
        className={`will-change-transform ${className}`}
      >
        {children}
      </motion.div>
    );
  }

  // Energetic Preset (3D perspective snap & scale with 100% GPU composition)
  if (intensity === 'energetic') {
    return (
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.94,
          rotateX: direction === 'up' ? (isMobile ? 0 : 10) : 0,
          ...pos,
        }}
        whileInView={{
          opacity: 1,
          scale: 1,
          rotateX: 0,
          x: 0,
          y: 0,
        }}
        viewport={{ once: true, margin: viewportMargin }}
        transition={{
          duration: 0.6,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={isMobile ? undefined : { perspective: 1000 }}
        className={`will-change-transform ${className}`}
      >
        {children}
      </motion.div>
    );
  }

  // Standard Preset
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, ...pos }}
      whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: viewportMargin }}
      transition={{ duration: 0.55, delay, ease: [0.215, 0.61, 0.355, 1] }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
};
