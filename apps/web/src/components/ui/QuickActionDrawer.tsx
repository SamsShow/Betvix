"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface ActionItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
}

interface QuickActionDrawerProps {
  open: boolean;
  onClose: () => void;
  actions: ActionItem[];
}

export function QuickActionDrawer({ open, onClose, actions }: QuickActionDrawerProps) {
  return (
    <div className={cn('fixed inset-0 z-[60] transition', open ? 'pointer-events-auto' : 'pointer-events-none')}
      aria-hidden={!open}
    >
      {/* Overlay */}
      <div
        className={cn(
          'absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity',
          open ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onClose}
      />
      {/* Sheet */}
      <div
        className={cn(
          'fixed left-1/2 -translate-x-1/2 bottom-0 w-full max-w-[430px] px-4 pb-6',
        )}
      >
        <div
          className={cn(
            'rounded-2xl border border-white/10 bg-background/90 backdrop-blur-md shadow-2xl transition-transform',
            open ? 'translate-y-0' : 'translate-y-[110%]'
          )}
        >
          <div className="p-4">
            <div className="h-1 w-10 rounded-full bg-white/20 mx-auto mb-3" />
            <div className="grid grid-cols-3 gap-3">
              {actions.map((a) => (
                <button
                  key={a.label}
                  onClick={() => { a.onClick(); onClose(); }}
                  className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-background-secondary/60 border border-white/10 hover:bg-white/5 transition"
                >
                  <div className="h-9 w-9 rounded-full flex items-center justify-center bg-accent-purple/20 text-accent-purple">
                    {a.icon ?? <span>+</span>}
                  </div>
                  <span className="text-xs text-text-primary text-center leading-tight">{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


