import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';

export const CursorSpotlight: React.FC = () => {
  const { data, colorMode } = usePortfolio();
  const config = data.settings.effectsConfig?.cursorSpotlight;

  const [isVisible, setIsVisible] = useState(false);
  const [isTouch] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
  });
  const visibleRef = useRef(false);

  const rawX = useMotionValue(-1000);
  const rawY = useMotionValue(-1000);

  // Smooth cinematic flashlight aura spring
  const springConfig = { damping: 32, stiffness: 220, mass: 0.6 };
  const smoothX = useSpring(rawX, springConfig);
  const smoothY = useSpring(rawY, springConfig);

  useEffect(() => {
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      if (!visibleRef.current) {
        visibleRef.current = true;
        setIsVisible(true);
      }
    };

    const handleMouseLeave = () => {
      visibleRef.current = false;
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      visibleRef.current = true;
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [rawX, rawY]);

  if (!config?.enabled || isTouch || !isVisible) {
    return null;
  }

  const { radius = 450, opacity = 0.16 } = config;
  const primaryColor = data.settings.customPrimaryColor || '#8b5cf6';
  const accentColor = data.settings.customAccentColor || '#06b6d4';

  const isDark = colorMode === 'dark';
  const effectiveOpacity = isDark ? opacity : opacity * 0.75;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          width: radius * 2,
          height: radius * 2,
          translateX: -radius,
          translateY: -radius,
          background: `radial-gradient(circle closest-side, ${primaryColor}44 0%, ${accentColor}25 35%, ${primaryColor}08 65%, transparent 100%)`,
          opacity: effectiveOpacity,
        }}
        className="fixed top-0 left-0 rounded-full pointer-events-none will-change-transform"
      />
    </motion.div>
  );
};
