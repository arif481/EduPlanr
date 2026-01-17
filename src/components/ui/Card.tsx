/**
 * Card Component
 * Glass-morphism styled card with optional hover effects
 */

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'elevated' | 'bordered' | 'gradient' | 'glow';
  glowColor?: 'cyan' | 'purple' | 'pink' | 'green';
  hoverable?: boolean;
  neonBorder?: boolean;
  children: React.ReactNode;
}

const variantStyles = {
  default: 'bg-dark-800/50 backdrop-blur-xl border border-dark-600/50',
  elevated: 'bg-dark-800/70 backdrop-blur-xl border border-dark-600/30 shadow-glass',
  bordered: 'bg-dark-900/50 backdrop-blur-xl border-2 border-dark-600',
  gradient: `
    bg-gradient-to-br from-dark-800/80 to-dark-900/80
    backdrop-blur-xl border border-dark-600/30
  `,
  glow: 'bg-dark-800/50 backdrop-blur-xl border border-dark-600/50',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      glowColor,
      hoverable = false,
      neonBorder = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const getGlowClass = () => {
      if (variant !== 'glow' || !glowColor) return '';
      
      const glowClasses = {
        cyan: 'shadow-neon-cyan',
        purple: 'shadow-neon-purple',
        pink: 'shadow-neon-magenta',
        green: 'shadow-neon-green',
      };
      
      return glowClasses[glowColor] || '';
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          'rounded-2xl p-6',
          variantStyles[variant],
          getGlowClass(),
          hoverable && 'transition-all duration-300 hover:translate-y-[-4px] hover:shadow-glow cursor-pointer',
          neonBorder && 'neon-border',
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

// Card Header
interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, icon, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between mb-4', className)}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="p-2 rounded-xl bg-dark-700/50 text-neon-cyan">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// Card Content
interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn('', className)}>{children}</div>;
}

// Card Footer
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-dark-600/50', className)}>
      {children}
    </div>
  );
}
