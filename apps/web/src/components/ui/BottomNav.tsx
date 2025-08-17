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
    <div className="fixed bottom-0 left-0 right-0 bg-background-card rounded-t-2xl shadow-lg border-t border-background-tertiary z-50">
      <div className="flex items-center justify-around h-16 px-2">
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
            className="w-12 h-12 rounded-full bg-accent-purple flex items-center justify-center -mt-5 shadow-lg"
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
