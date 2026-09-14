import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'pulse' | 'glow';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
  icon,
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors',
        {
          'bg-white/10 text-white/90 border border-white/10': variant === 'default',
          'bg-transparent text-white/80 border border-white/20': variant === 'outline',
          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30': variant === 'pulse',
          'bg-purple-500/10 text-purple-300 border border-purple-500/30 glow-primary': variant === 'glow',
        },
        className
      )}
    >
      {variant === 'pulse' && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
      )}
      {icon}
      {children}
    </span>
  );
};
