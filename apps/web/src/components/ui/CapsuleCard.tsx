"use client";

import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface CapsuleCardProps {
  title: string;
  lines?: string[];
  deadline: Date;
  odds: {
    yes: number;
    no: number;
  };
  status: 'open' | 'closed' | 'resolved_yes' | 'resolved_no' | 'invalid';
  selectedSide?: 'yes' | 'no';
  onVote?: (side: 'yes' | 'no') => void;
  className?: string;
}

export function CapsuleCard({
  title,
  lines = [],
  deadline,
  odds,
  status,
  selectedSide,
  onVote,
  className,
}: CapsuleCardProps) {
  const isResolved = status.startsWith('resolved_');
  const isOpen = status === 'open';
  
  const yesPercentage = Math.round(odds.yes * 100);
  const noPercentage = Math.round(odds.no * 100);
  
  const isUserVoting = selectedSide !== undefined && onVote !== undefined;
  const endingIn = formatDistanceToNow(deadline, { addSuffix: true });
  
  const resolvedText = 
    status === 'resolved_yes' ? 'Resolved: Yes' :
    status === 'resolved_no' ? 'Resolved: No' :
    status === 'invalid' ? 'Invalid' :
    null;
  
  return (
    <div 
      className={`
        bg-background-card rounded-card overflow-hidden
        ${
          isOpen ? 
          'cursor-pointer hover:shadow-card-hover transition-all overflow-hidden border border-background-tertiary hover:border-accent-primary/30' :
          'opacity-80'
        }
        ${className || ''}
      `}
    >
      {/* Header: Odds display */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Odds circle */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent-primary/10 border border-accent-primary/20">
            <span className="text-accent-primary font-semibold text-sm">{yesPercentage}%</span>
          </div>
          
          {/* Status indicator */}
          <div>
            <div className="text-text-secondary text-sm">
              {isResolved ? 'Resolved' : `Ends ${endingIn}`}
            </div>
            {resolvedText && (
              <div className="text-xs text-accent-primary font-medium">
                {resolvedText}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Body: Market statement and description */}
      <div className="px-4 py-3">
        <h3 className="text-headline-small font-bold mb-2">{title}</h3>
        <div className="space-y-1">
          {lines.map((line, i) => (
            <p key={i} className="text-text-secondary text-sm">{line}</p>
          ))}
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="px-4 pb-2">
        <div className="w-full bg-background-secondary/80 rounded-full h-1.5">
          <div 
            className="h-full bg-accent-primary" 
            style={{ width: `${yesPercentage}%` }}
          />
        </div>
      </div>
      
      {/* Footer: Yes/No buttons */}
      {isUserVoting && (
        <div className="flex border-t border-background-tertiary/20">
          <button 
            className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
              selectedSide === 'yes'
                ? 'bg-accent-primary text-white'
                : 'bg-background-secondary hover:bg-background-tertiary text-accent-primary'
            }`}
            onClick={() => onVote('yes')}
          >
            Yes
          </button>
          <button 
            className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
              selectedSide === 'no'
                ? 'bg-market-red text-white'
                : 'bg-background-secondary hover:bg-background-tertiary text-market-red'
            }`}
            onClick={() => onVote('no')}
          >
            No
          </button>
        </div>
      )}
    </div>
  );
}