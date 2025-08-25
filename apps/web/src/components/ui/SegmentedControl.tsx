"use client";

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SegmentedControlProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SegmentedControl({ options, value, onChange, className }: SegmentedControlProps) {
  const [sliderPosition, setSliderPosition] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = options.findIndex(option => option === value);
  
  useEffect(() => {
    const updateSliderPosition = () => {
      const selectedItem = itemsRef.current[activeIndex];
      if (selectedItem) {
        setSliderPosition(selectedItem.offsetLeft);
        setSliderWidth(selectedItem.offsetWidth);
      }
    };
    
    updateSliderPosition();
    window.addEventListener('resize', updateSliderPosition);
    
    return () => window.removeEventListener('resize', updateSliderPosition);
  }, [activeIndex, options]);
  
  return (
    <div 
      className={cn(
        "relative flex rounded-lg bg-background-secondary/30 p-1 w-full md:w-auto",
        className
      )}
    >
      <div 
        style={{ left: sliderPosition, width: sliderWidth }}
        className="absolute top-1 bottom-1 rounded-md bg-accent-primary pointer-events-none transition-all duration-300"
      />
      
      {options.map((option, i) => (
        <button
          key={option}
          ref={(el: HTMLButtonElement | null) => { if (itemsRef.current) itemsRef.current[i] = el; }}
          className={cn(
            "relative flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors z-10",
            value === option ? "text-white" : "text-text-secondary hover:text-text-primary"
          )}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}