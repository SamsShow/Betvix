"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface OddsDisplayProps {
  value: number; // 0-1 representing percentage
  variant?: 'primary' | 'outline' | 'modern';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function OddsDisplay({
  value,
  variant = 'modern',
  size = 'md',
  className,
}: OddsDisplayProps) {
  const percentage = Math.round(value * 100);
  
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center',
        {
          'px-2 py-1': size === 'sm',
          'px-3 py-1.5': size === 'md',
          'px-4 py-2': size === 'lg',
          
          'rounded-full bg-accent-primary text-white': variant === 'primary',
          
          'rounded-full border border-accent-primary bg-transparent text-accent-primary': variant === 'outline',
          'rounded-lg bg-accent-primary/10 text-accent-primary font-semibold': variant === 'modern',
        },
        className
      )}
    >
      <span className={cn(
        {
          'text-xs': size === 'sm',
          'text-sm': size === 'md',
          'text-base': size === 'lg',
        }
      )}>
        {percentage}%
      </span>
    </div>
  );
}