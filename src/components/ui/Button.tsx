/**
 * Button Component
 * Versatile button with multiple variants and sizes
 */

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size' | 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-r from-accent-primary to-accent-secondary
    text-white font-semibold
    hover:shadow-neon-purple hover:scale-[1.02]
    active:scale-[0.98]
  `,
  secondary: `
    bg-dark-700 border border-dark-500
    text-gray-200
    hover:bg-dark-600 hover:border-neon-cyan/50
    active:scale-[0.98]
  `,
  ghost: `
    bg-transparent
    text-gray-300
    hover:bg-dark-700/50 hover:text-white
    active:scale-[0.98]
  `,
  danger: `
    bg-red-600/20 border border-red-500/50
    text-red-400
    hover:bg-red-600/30 hover:border-red-500
    active:scale-[0.98]
  `,
  outline: `
    bg-transparent border border-dark-500
    text-gray-300
    hover:border-neon-cyan/50 hover:text-neon-cyan
    active:scale-[0.98]
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
  icon: 'p-2.5 rounded-xl',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'relative inline-flex items-center justify-center gap-2',
          'font-medium transition-all duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon}
        {size !== 'icon' && children}
        {!isLoading && rightIcon}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
