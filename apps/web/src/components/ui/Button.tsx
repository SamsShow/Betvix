"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export function Button({ 
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
}: ButtonProps) {
  return (
    <button
      className={cn(
        'font-medium rounded-button transition-all flex items-center justify-center',
        {
          // Variants
          'bg-accent-purple hover:bg-accent-purple-dark text-white': variant === 'primary',
          'bg-background-secondary hover:bg-background-tertiary text-text-primary': variant === 'secondary',
          'border border-accent-purple text-accent-purple hover:bg-accent-purple/10': variant === 'outline',
          'bg-transparent text-accent-purple hover:bg-accent-purple/10': variant === 'text',
          'bg-background-secondary hover:bg-background-tertiary p-2': variant === 'icon',
          
          // Sizes (excluding icon variant)
          'text-sm px-3 py-2': size === 'sm' && variant !== 'icon',
          'px-4 py-3': size === 'md' && variant !== 'icon',
          'text-lg px-6 py-4': size === 'lg' && variant !== 'icon',
          
          // Icon sizes
          'p-1': size === 'sm' && variant === 'icon',
          'p-2': size === 'md' && variant === 'icon',
          'p-3': size === 'lg' && variant === 'icon',
          
          // Width
          'w-full': fullWidth,
          
          // Disabled state
          'opacity-50 cursor-not-allowed': disabled || isLoading,
        },
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {leftIcon && !isLoading && (
        <span className="mr-2 flex items-center">{leftIcon}</span>
      )}
      
      {children}
      
      {rightIcon && (
        <span className="ml-2 flex items-center">{rightIcon}</span>
      )}
    </button>
  );
}
