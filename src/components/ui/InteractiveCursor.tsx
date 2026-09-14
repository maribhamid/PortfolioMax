import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';

export const InteractiveCursor: React.FC = () => {
  const { data } = usePortfolio();
  const config = data.settings.effectsConfig?.customCursor;

  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTouchDevice] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
  });

  const hoveredRef = useRef(false);
  const visibleRef = useRef(false);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  // Buttery-smooth spring physics
  const springConfig = { damping: 28, stiffness: 380, mass: 0.35 };
  const smoothX = useSpring(rawX, springConfig);
  const smoothY = useSpring(rawY, springConfig);

  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);

      if (!visibleRef.current) {
        visibleRef.current = true;
        setIsVisible(true);
      }

      // Fast check: Only update state when interactive status changes
      const target = e.target as HTMLElement | null;
      const isInteractive = target
        ? Boolean(
            target.closest('a, button, [role="button"], input, textarea, select, .magnetic-btn, .cursor-pointer, [data-interactive="true"]')
          )
        : false;

      if (hoveredRef.current !== isInteractive) {
        hoveredRef.current = isInteractive;
        setIsHovered(isInteractive);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseLeave = () => {
      visibleRef.current = false;
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      visibleRef.current = true;
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [rawX, rawY]);

  if (!config?.enabled || isTouchDevice || !isVisible) {
    return null;
  }

  const { style = 'neon-ring', size = 34, glowIntensity = 0.7 } = config;
  const primaryColor = data.settings.customPrimaryColor || '#8b5cf6';
  const accentColor = data.settings.customAccentColor || '#06b6d4';

  const halfSize = size / 2;
  const scale = isClicking ? 0.85 : isHovered ? 1.45 : 1.0;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden will-change-transform">
      {/* 1. NEON-RING STYLE */}
      {style === 'neon-ring' && (
        <>
          <motion.div
            style={{
              x: smoothX,
              y: smoothY,
              width: size,
              height: size,
              translateX: -halfSize,
              translateY: -halfSize,
            }}
            animate={{
              scale,
              borderColor: isHovered ? accentColor : primaryColor,
              backgroundColor: isHovered ? `${primaryColor}22` : 'transparent',
              boxShadow: `0 0 ${14 * glowIntensity}px ${primaryColor}88`,
            }}
            transition={{ duration: 0.12 }}
            className="fixed top-0 left-0 rounded-full border-2 will-change-transform"
          />

          <motion.div
            style={{
              x: rawX,
              y: rawY,
              translateX: -3,
              translateY: -3,
            }}
            animate={{
              scale: isClicking ? 1.4 : isHovered ? 0.4 : 1,
              backgroundColor: isHovered ? accentColor : '#ffffff',
            }}
            transition={{ duration: 0.1 }}
            className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full will-change-transform"
          />
        </>
      )}

      {/* 2. CYBER-CROSSHAIR STYLE */}
      {style === 'cyber-crosshair' && (
        <motion.div
          style={{
            x: smoothX,
            y: smoothY,
            width: size * 1.2,
            height: size * 1.2,
            translateX: -(size * 1.2) / 2,
            translateY: -(size * 1.2) / 2,
          }}
          animate={{
            scale,
            rotate: isHovered ? 45 : 0,
          }}
          transition={{ duration: 0.18 }}
          className="fixed top-0 left-0 flex items-center justify-center will-change-transform"
        >
          <div
            className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2"
            style={{ borderColor: primaryColor }}
          />
          <div
            className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2"
            style={{ borderColor: primaryColor }}
          />
          <div
            className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2"
            style={{ borderColor: primaryColor }}
          />
          <div
            className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2"
            style={{ borderColor: primaryColor }}
          />

          <div
            style={{
              width: 4,
              height: 4,
              backgroundColor: accentColor,
            }}
            className="rounded-full shadow-sm"
          />
        </motion.div>
      )}

      {/* 3. GLOW-ORB STYLE */}
      {style === 'glow-orb' && (
        <motion.div
          style={{
            x: smoothX,
            y: smoothY,
            width: size * 1.5,
            height: size * 1.5,
            translateX: -(size * 1.5) / 2,
            translateY: -(size * 1.5) / 2,
            background: `radial-gradient(circle, ${primaryColor}cc 0%, ${accentColor}88 40%, transparent 70%)`,
          }}
          animate={{
            scale: isClicking ? 0.75 : isHovered ? 1.5 : 1.0,
            opacity: isHovered ? 0.85 : 0.6 * glowIntensity,
          }}
          transition={{ duration: 0.15 }}
          className="fixed top-0 left-0 rounded-full blur-[4px] will-change-transform"
        />
      )}

      {/* 4. MINIMAL-DOT STYLE */}
      {style === 'minimal-dot' && (
        <>
          <motion.div
            style={{
              x: smoothX,
              y: smoothY,
              width: isHovered ? size : 10,
              height: isHovered ? size : 10,
              translateX: isHovered ? -halfSize : -5,
              translateY: isHovered ? -halfSize : -5,
            }}
            animate={{
              backgroundColor: isHovered ? `${primaryColor}20` : primaryColor,
              border: isHovered ? `2px solid ${primaryColor}` : 'none',
            }}
            transition={{ duration: 0.12 }}
            className="fixed top-0 left-0 rounded-full will-change-transform"
          />
          <motion.div
            style={{
              x: rawX,
              y: rawY,
              translateX: -2,
              translateY: -2,
            }}
            className="fixed top-0 left-0 w-1 h-1 rounded-full bg-white will-change-transform"
          />
        </>
      )}
    </div>
  );
};
