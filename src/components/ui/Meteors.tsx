import React, { useMemo } from 'react';
import { cn } from '../../lib/utils';

interface MeteorsProps {
  number?: number;
  className?: string;
}

export const Meteors: React.FC<MeteorsProps> = ({ number = 20, className }) => {
  const meteorStyles = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const effectiveNumber = isMobile ? Math.min(8, number) : number;
    return Array.from({ length: effectiveNumber }).map(() => ({
      top: Math.floor(Math.random() * 80) - 20 + '%',
      left: Math.floor(Math.random() * 100) + '%',
      animationDelay: (Math.random() * 5).toFixed(2) + 's',
      animationDuration: Math.floor(Math.random() * 8 + 4) + 's',
    }));
  }, [number]);

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none z-0 will-change-transform', className)}>
      {meteorStyles.map((style, idx) => (
        <span
          key={'meteor-' + idx}
          style={style}
          className={cn(
            'animate-meteor-effect absolute h-0.5 w-0.5 rounded-[9999px] bg-slate-200 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg] will-change-transform',
            "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#a855f7] before:to-transparent"
          )}
        />
      ))}
    </div>
  );
};
