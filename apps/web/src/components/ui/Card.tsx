import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'highlight' | 'transparent' | 'glass' | 'modern';
  children: React.ReactNode;
}

export function Card({ 
  variant = 'default', 
  className, 
  children, 
  ...props 
}: CardProps) {
  return (
    <div 
      className={cn(
        'relative transition-all overflow-hidden',
        {
          'bg-background-card p-card-padding rounded-card shadow-card': variant === 'default',
          'bg-background-secondary p-card-padding rounded-card border border-accent-purple/20 shadow-card': variant === 'highlight',
          'bg-transparent': variant === 'transparent',
          // Subtle glass card used across the mobile UI
          'bg-background-card/80 backdrop-blur-md p-card-padding rounded-card border border-white/10 shadow-card': variant === 'glass',
          // Modern flat design for Polymarket style
          'bg-background-card p-card-padding rounded-xl border border-background-tertiary/50 hover:border-background-tertiary': variant === 'modern',
        },
        className
      )}
      {...props}
    >
      {/* Inner gradient sheen for depth */}
      {variant !== 'transparent' && (
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-1/2 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_-10%,rgba(157,138,200,0.08),transparent)]" />
        </div>
      )}
      {/* Ripple container */}
      <span className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(circle_at_var(--x)_var(--y),black_0%,transparent_40%)] opacity-0 transition-opacity duration-500" />
      {children}
    </div>
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div 
      className={cn(
        'flex flex-col items-start mb-3 p-4 pb-0',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function CardTitle({ className, children, ...props }: CardTitleProps) {
  return (
    <h3 
      className={cn(
        'text-headline-small font-bold text-text-primary',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div 
      className={cn('p-4 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div 
      className={cn(
        'flex items-center justify-between px-4 py-3 border-t border-background-tertiary',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardActionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardAction({ className, children, ...props }: CardActionProps) {
  return (
    <div 
      className={cn(
        'flex items-center justify-center',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Utility HOC to attach ripple-on-click to any card
export function withRipple<T extends React.HTMLAttributes<HTMLDivElement>>(Component: React.ComponentType<T>) {
  return function RippleComponent(props: T) {
    const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      target.style.setProperty('--x', `${x}px`);
      target.style.setProperty('--y', `${y}px`);
      const ripple = target.querySelector('span') as HTMLElement | null;
      if (ripple) {
        ripple.style.opacity = '0.35';
        requestAnimationFrame(() => {
          ripple.style.transition = 'opacity 500ms ease-out';
          ripple.style.opacity = '0';
        });
      }
      props.onClick && props.onClick(e as any);
    };
    return <Component {...props} onClick={handleClick} />;
  };
}
