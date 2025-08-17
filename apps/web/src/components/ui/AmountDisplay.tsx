import React from 'react';
import { cn } from '@/lib/utils';

interface AmountDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  trend?: 'up' | 'down' | 'neutral';
  showTrendIndicator?: boolean;
}

export function AmountDisplay({
  value,
  currency = '$',
  size = 'md',
  trend = 'neutral',
  showTrendIndicator = false,
  className,
  ...props
}: AmountDisplayProps) {
  const formattedValue = typeof value === 'number' 
    ? value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : value;
    
  return (
    <div 
      className={cn(
        'font-medium flex items-center',
        {
          'text-body-large': size === 'sm',
          'text-headline-small': size === 'md',
          'text-headline-large': size === 'lg',
          'text-display-medium': size === 'xl',
          'text-accent-green': trend === 'up',
          'text-red-500': trend === 'down',
        },
        className
      )}
      {...props}
    >
      {showTrendIndicator && trend !== 'neutral' && (
        <span className="mr-1">
          {trend === 'up' ? '↑' : '↓'}
        </span>
      )}
      <span>{currency}</span>
      <span className="ml-1">{formattedValue}</span>
    </div>
  );
}
