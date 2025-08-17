"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

interface BottomNavProps {
  items: NavItem[];
  centerAction?: {
    icon: React.ReactNode;
    onClick: () => void;
  };
  currentPath: string;
}

export function BottomNav({
  items,
  centerAction,
  currentPath,
}: BottomNavProps) {
  // Split items to accommodate center action
  const halfLength = Math.floor(items.length / 2);
  const leftItems = items.slice(0, centerAction ? halfLength : items.length);
  const rightItems = centerAction ? items.slice(halfLength) : [];
  
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] rounded-t-2xl z-50">
      <div className="relative h-16">
        <div className="absolute inset-0 rounded-t-2xl bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
        <div className="absolute inset-0 rounded-t-2xl bg-background-card/90 backdrop-blur-md border-t border-white/10" />
        <div className="relative flex items-center justify-around h-16 px-2">
          {leftItems.map((item, idx) => (
            <NavItem 
              key={`left-${idx}`}
              {...item} 
              isActive={currentPath === item.href} 
            />
          ))}
          
          {centerAction && (
            <button 
              onClick={centerAction.onClick}
              className="w-12 h-12 rounded-full bg-accent-purple flex items-center justify-center -mt-6 shadow-lg"
            >
              {centerAction.icon}
            </button>
          )}
          
          {rightItems.map((item, idx) => (
            <NavItem 
              key={`right-${idx}`}
              {...item} 
              isActive={currentPath === item.href} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface NavItemProps extends NavItem {
  isActive: boolean;
}

function NavItem({ icon, label, href, isActive }: NavItemProps) {
  return (
    <Link 
      href={href}
      className={cn(
        'flex flex-col items-center justify-center w-16',
        isActive ? 'text-accent-purple' : 'text-text-tertiary'
      )}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
}
