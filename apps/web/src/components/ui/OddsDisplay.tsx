import React from 'react';
import { cn } from '@/lib/utils';

interface OddsDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline' | 'modern';
}

export function OddsDisplay({
  value,
  size = 'md',
  variant = 'primary',
  className,
  ...props
}: OddsDisplayProps) {
  // Format to percentage with 0 decimal places
  const formattedValue = `${Math.round(value * 100)}%`;
  
  return (
    <div 
      className={cn(
        'flex items-center justify-center font-medium',
        {
          // Size variations
          'text-xs h-6 w-10': size === 'sm',
          'text-sm h-8 w-14': size === 'md',
          'text-base h-10 w-16': size === 'lg',
          
          // Variant styles
          'rounded-full bg-accent-purple text-white': variant === 'primary',
          'rounded-full bg-background-secondary text-text-primary': variant === 'secondary',
          'rounded-full border border-accent-purple bg-transparent text-accent-purple': variant === 'outline',
          'rounded-lg bg-accent-purple/10 text-accent-purple font-semibold': variant === 'modern',
        },
        className
      )}
      {...props}
    >
      {formattedValue}
    </div>
  );
}
