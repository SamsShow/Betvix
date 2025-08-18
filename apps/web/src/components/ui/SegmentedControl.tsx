"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface SegmentedControlProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SegmentedControl({ options, value, onChange, className }: SegmentedControlProps) {
  return (
    <div className={cn('relative inline-flex items-center rounded-lg bg-background-card p-1 border border-background-tertiary/50', className)}>
      {/* Animated active pill */}
      <div
        className="absolute top-1 bottom-1 rounded-md bg-accent-purple pointer-events-none transition-all duration-300"
        style={{
          left: `${Math.max(options.indexOf(value), 0) * (100 / options.length)}%`,
          width: `${100 / options.length}%`,
        }}
      />
      {options.map((option) => {
        const isActive = option === value;
        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={cn(
              'relative z-10 px-4 py-1.5 rounded-md text-sm font-medium transition-all',
              isActive
                ? 'text-white'
                : 'text-text-secondary hover:text-text-primary'
            )}
            aria-pressed={isActive}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}


