"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'icon' | 'surface' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  pill?: boolean; // force full pill radius
  children?: React.ReactNode;
}

export function Button({ 
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  pill = false,
  className, 
  children,
  disabled,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        // Base
        'relative inline-flex items-center justify-center font-medium select-none whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed outline-none transition-all active:scale-[.97] focus-visible:ring-2 focus-visible:ring-accent-purple/50 gap-2',
        'rounded-button',
        pill && 'rounded-full',
        {
          // Variants
          'bg-gradient-to-br from-accent-purple-dark to-accent-purple text-white shadow-sm hover:shadow-md hover:from-accent-purple to-accent-purple-dark': variant === 'primary',
          'bg-background-secondary/80 backdrop-blur border border-background-tertiary text-text-primary hover:bg-background-tertiary': variant === 'secondary',
          'border border-accent-purple/40 text-accent-purple hover:bg-accent-purple/10': variant === 'outline',
          'bg-transparent text-accent-purple hover:bg-accent-purple/10': variant === 'text',
          'bg-background-secondary hover:bg-background-tertiary p-0': variant === 'icon',
          'bg-background-card/60 border border-background-tertiary hover:border-accent-purple/30 text-text-primary shadow-sm hover:shadow-md': variant === 'surface',
          'bg-background-secondary/40 hover:bg-background-secondary/60 text-text-secondary': variant === 'ghost',
          
          // Sizes (excluding icon variant)
          'h-7 text-xs px-3': size === 'xs' && variant !== 'icon',
          'h-8 text-sm px-3': size === 'sm' && variant !== 'icon',
          'h-10 text-sm px-4': size === 'md' && variant !== 'icon',
          'h-11 text-base px-5': size === 'lg' && variant !== 'icon',
          'h-12 text-base px-6': size === 'xl' && variant !== 'icon',
          
          // Icon button sizes
          'h-7 w-7': size === 'xs' && variant === 'icon',
          'h-8 w-8': size === 'sm' && variant === 'icon',
            'h-10 w-10': size === 'md' && variant === 'icon',
          'h-11 w-11': size === 'lg' && variant === 'icon',
          'h-12 w-12': size === 'xl' && variant === 'icon',
          
          // Width
          'w-full': fullWidth,
        },
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg className={cn('animate-spin text-current', {
            'h-4 w-4': size === 'xs' || size === 'sm',
            'h-5 w-5': size === 'md' || size === 'lg',
            'h-6 w-6': size === 'xl',
          })} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      )}
      {!isLoading && leftIcon && (
        <span className={cn('flex items-center', {
          'text-sm': size === 'xs',
        })}>{leftIcon}</span>
      )}
      <span className={cn(isLoading && 'opacity-0')}>{children}</span>
      {!isLoading && rightIcon && (
        <span className={cn('flex items-center', {
          'text-sm': size === 'xs',
        })}>{rightIcon}</span>
      )}
    </button>
  );
}
