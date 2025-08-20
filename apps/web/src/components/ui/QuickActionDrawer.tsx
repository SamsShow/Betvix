"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickActionDrawerProps {
  open: boolean;
  onClose: () => void;
  actions: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  }[];
}

export function QuickActionDrawer({
  open,
  onClose,
  actions,
}: QuickActionDrawerProps) {
  // Trap focus when drawer is open
  const drawerRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    
    if (open) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);
  
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            ref={drawerRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 bg-background-card border-t border-background-tertiary/20 rounded-t-2xl p-6 z-50 shadow-xl"
          >
            <div className="w-12 h-1 bg-background-tertiary/30 rounded-full mx-auto mb-6" />
            
            <h3 className="text-headline-medium font-semibold mb-6 text-center">Quick Actions</h3>
            
            <div className="space-y-4">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    action.onClick();
                    onClose();
                  }}
                  className="w-full flex items-center p-4 rounded-xl hover:bg-background-secondary/30 transition-colors"
                >
                  <div className="h-9 w-9 rounded-full flex items-center justify-center bg-accent-primary/20 text-accent-primary">
                    {action.icon || (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    )}
                  </div>
                  <span className="ml-4 text-text-primary font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}