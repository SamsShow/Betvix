import React from 'react';
import { cn } from '@/lib/utils';

interface OddsDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
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
        'rounded-full flex items-center justify-center font-medium',
        {
          // Size variations
          'text-xs px-2 py-1': size === 'sm',
          'text-sm px-3 py-1.5': size === 'md',
          'text-base px-4 py-2': size === 'lg',
          
          // Variant styles
          'bg-accent-purple text-white': variant === 'primary',
          'bg-background-secondary text-text-primary': variant === 'secondary',
          'border border-accent-purple bg-transparent text-accent-purple': variant === 'outline',
        },
        className
      )}
      {...props}
    >
      {formattedValue}
    </div>
  );
}
