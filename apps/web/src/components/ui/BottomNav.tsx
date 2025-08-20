"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  quickAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  className?: string;
}

export function BottomNav({ quickAction, className }: BottomNavProps) {
  const pathname = usePathname();
  
  // Navigation items
  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    },
    {
      label: 'Markets',
      href: '/markets',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      )
    },
    {
      // Placeholder for center quick action
      label: '',
      href: '',
      icon: <></>
    },
    {
      label: 'Portfolio',
      href: '/portfolio',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      )
    },
    {
      label: 'Profile',
      href: '/profile',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    }
  ];
  
  const isActive = (href: string) => pathname === href;
  
  return (
    <div className={cn("fixed bottom-0 left-0 right-0 bg-background-card border-t border-background-tertiary/10 shadow-lg z-40", className)}>
      <div className="flex items-center justify-around h-16">
        {navItems.map((item, i) => {
          // Center quick action
          if (i === 2) {
            return (
              <div key="quickAction" className="relative flex flex-col items-center justify-center -mt-6">
                <button 
                  onClick={quickAction?.onClick}
                  className="w-12 h-12 rounded-full bg-accent-primary flex items-center justify-center -mt-6 shadow-lg"
                >
                  {quickAction?.icon || (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  )}
                </button>
                <span className="text-xs font-medium mt-1 text-accent-primary">{quickAction?.label || 'New'}</span>
              </div>
            );
          }
          
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className="flex flex-col items-center justify-center"
            >
              <div className={cn(
                "flex items-center justify-center transition-colors", 
                isActive(item.href) ? 'text-accent-primary' : 'text-text-tertiary'
              )}>
                {item.icon}
              </div>
              <span className={cn(
                "text-xs font-medium mt-1",
                isActive(item.href) ? 'text-accent-primary' : 'text-text-tertiary'
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}