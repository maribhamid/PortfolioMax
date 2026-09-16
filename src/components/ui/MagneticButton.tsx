import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, HTMLMotionProps } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';

interface MagneticButtonProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  disabled?: boolean;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  strength,
  disabled = false,
  ...props
}) => {
  const { data } = usePortfolio();
  const config = data.settings.effectsConfig?.magneticButtons;
  const ref = useRef<HTMLDivElement | null>(null);
  const rectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);
  const [isTouch, setIsTouch] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTouch(window.matchMedia('(hover: none)').matches);
    }
  }, []);

  const isEnabled = !disabled && !isTouch && (config?.enabled ?? true);
  const baseStrength = strength ?? config?.strength ?? 0.35;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Snappy, organic spring response with will-change optimization
  const springConfig = { damping: 18, stiffness: 240, mass: 0.25 };
  const smoothX = useSpring(rawX, springConfig);
  const smoothY = useSpring(rawY, springConfig);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (ref.current) {
      const b = ref.current.getBoundingClientRect();
      rectRef.current = { left: b.left, top: b.top, width: b.width, height: b.height };
    }
    if (props.onMouseEnter) props.onMouseEnter(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEnabled) return;

    // Use cached rect or fallback if needed
    const rect = rectRef.current || ref.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * baseStrength;
    const deltaY = (e.clientY - centerY) * baseStrength;

    rawX.set(deltaX);
    rawY.set(deltaY);

    if (props.onMouseMove) props.onMouseMove(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    rawX.set(0);
    rawY.set(0);
    rectRef.current = null;
    if (props.onMouseLeave) props.onMouseLeave(e);
  };

  return (
    <motion.div
      ref={ref}
      style={isEnabled ? { x: smoothX, y: smoothY } : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`magnetic-btn inline-block cursor-pointer will-change-transform ${className}`}
      data-interactive="true"
      {...props}
    >
      {children}
    </motion.div>
  );
};
