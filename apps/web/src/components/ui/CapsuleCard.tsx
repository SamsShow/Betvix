"use client";

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
  onVote?: (side: 'yes' | 'no') => void;
  selectedSide?: 'yes' | 'no';
}

export function CapsuleCard({
  title,
  lines,
  deadline,
  odds,
  status = 'open',
  className,
  onCardClick,
  onVote,
  selectedSide,
  ...props
}: CapsuleCardProps) {
  // Format the deadline
  const formattedDeadline = typeof deadline === 'string' 
    ? new Date(deadline).toLocaleDateString() 
    : deadline.toLocaleDateString();
  
  return (
    <Card 
      variant="glass"
      className={cn(
        'cursor-pointer hover:shadow-card-hover transition-shadow',
        className
      )}
      onClick={onCardClick}
      {...props}
    >
      <CardHeader className="items-start">
        <CardTitle className="pr-12 leading-snug">{title}</CardTitle>
        {status === 'open' && (
          <div className="absolute right-4 -mt-2">
            <OddsDisplay value={odds.yes} size="sm" />
          </div>
        )}
        {status !== 'open' && (
          <span className={cn(
            'text-xs font-medium px-2 py-1 rounded-full',
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
        <div className="space-y-1.5 mb-3">
          {lines.map((line, index) => (
            <p key={index} className="text-text-secondary text-body-medium">
              {line}
            </p>
          ))}
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onVote?.('yes'); }}
              className={cn(
                'text-xs px-2 py-1 rounded-full border transition-colors',
                selectedSide === 'yes'
                  ? 'bg-accent-purple text-white border-accent-purple'
                  : 'text-accent-purple border-accent-purple/40 bg-accent-purple/10 hover:bg-accent-purple/15'
              )}
            >
              Yes {Math.round(odds.yes * 100)}%
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onVote?.('no'); }}
              className={cn(
                'text-xs px-2 py-1 rounded-full border transition-colors',
                selectedSide === 'no'
                  ? 'bg-red-500 text-white border-red-500'
                  : 'text-red-400 border-red-500/40 bg-red-500/10 hover:bg-red-500/15'
              )}
            >
              No {Math.round(odds.no * 100)}%
            </button>
          </div>
          
          <div className="text-text-tertiary text-xs">
            Ends: {formattedDeadline}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
