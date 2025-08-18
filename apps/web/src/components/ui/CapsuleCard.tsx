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
  
  // Calculate remaining time
  const today = new Date();
  const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline;
  const daysRemaining = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Format odds percentages
  const yesPercentage = Math.round(odds.yes * 100);
  const noPercentage = Math.round(odds.no * 100);
  
  return (
    <Card 
      className={cn(
        'cursor-pointer hover:shadow-card-hover transition-all overflow-hidden border border-background-tertiary hover:border-accent-purple/30',
        className
      )}
      onClick={onCardClick}
      {...props}
    >
      <div className="relative">
        {/* Chance indicator */}
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent-purple/10 border border-accent-purple/20">
            <span className="text-accent-purple font-semibold text-sm">{yesPercentage}%</span>
          </div>
        </div>
        
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-headline-small font-bold leading-tight">{title}</CardTitle>
          </div>
          
          {status !== 'open' && (
            <span className={cn(
              'text-xs font-semibold px-2 py-1 rounded-md inline-block mt-2',
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
          <div className="space-y-2 mb-4">
            {lines.map((line, index) => (
              <p key={index} className="text-text-secondary text-body-small">
                {line}
              </p>
            ))}
          </div>
          
          {/* Market analytics */}
          <div className="flex items-center justify-between text-xs text-text-secondary mb-4">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{daysRemaining} days left</span>
            </div>
            <div>
              <span>Ends: {formattedDeadline}</span>
            </div>
          </div>
          
          {/* Progress bar for odds */}
          <div className="h-1.5 w-full bg-background-secondary rounded-full overflow-hidden mb-3">
            <div 
              className="h-full bg-accent-purple" 
              style={{ width: `${yesPercentage}%` }}
            />
          </div>
          
          {/* Voting buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onVote?.('yes'); }}
              className={cn(
                'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
                selectedSide === 'yes'
                  ? 'bg-accent-purple text-white'
                  : 'bg-background-secondary hover:bg-background-tertiary text-accent-purple'
              )}
            >
              Yes {yesPercentage}%
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onVote?.('no'); }}
              className={cn(
                'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
                selectedSide === 'no'
                  ? 'bg-red-500 text-white'
                  : 'bg-background-secondary hover:bg-background-tertiary text-red-400'
              )}
            >
              No {noPercentage}%
            </button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
