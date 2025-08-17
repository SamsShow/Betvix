import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { OddsDisplay } from './OddsDisplay';

interface CapsuleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  lines: string[];
  deadline: string | Date;
  odds: {
    yes: number;
    no: number;
  };
  status?: 'open' | 'closed' | 'resolved' | 'invalid';
  onCardClick?: () => void;
}

export function CapsuleCard({
  title,
  lines,
  deadline,
  odds,
  status = 'open',
  className,
  onCardClick,
  ...props
}: CapsuleCardProps) {
  // Format the deadline
  const formattedDeadline = typeof deadline === 'string' 
    ? new Date(deadline).toLocaleDateString() 
    : deadline.toLocaleDateString();
  
  return (
    <Card 
      className={cn(
        'cursor-pointer hover:shadow-card-hover transition-shadow',
        className
      )}
      onClick={onCardClick}
      {...props}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {status === 'open' && (
          <OddsDisplay value={odds.yes} />
        )}
        {status !== 'open' && (
          <span className={cn(
            'text-sm font-medium px-2 py-1 rounded-full',
            {
              'bg-yellow-500/20 text-yellow-400': status === 'closed',
              'bg-accent-green/20 text-accent-green': status === 'resolved',
              'bg-red-500/20 text-red-400': status === 'invalid',
            }
          )}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2 mb-3">
          {lines.map((line, index) => (
            <p key={index} className="text-text-secondary text-body-medium">
              {line}
            </p>
          ))}
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2">
            <span className="text-accent-purple bg-accent-purple/10 text-xs px-2 py-1 rounded-full">
              Yes: {Math.round(odds.yes * 100)}%
            </span>
            <span className="text-red-400 bg-red-500/10 text-xs px-2 py-1 rounded-full">
              No: {Math.round(odds.no * 100)}%
            </span>
          </div>
          
          <div className="text-text-tertiary text-xs">
            Ends: {formattedDeadline}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
