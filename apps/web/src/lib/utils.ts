import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as currency
 */
export function formatCurrency(
  amount: number,
  currency: string = '$',
  minimumFractionDigits: number = 2,
  maximumFractionDigits: number = 2
): string {
  return `${currency}${amount.toLocaleString('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
  })}`;
}

/**
 * Format a percentage
 */
export function formatPercentage(
  value: number,
  minimumFractionDigits: number = 0,
  maximumFractionDigits: number = 0
): string {
  return `${(value * 100).toLocaleString('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
  })}%`;
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Truncate an address
 */
export function truncateAddress(address: string, start: number = 6, end: number = 4): string {
  if (!address) return '';
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

/**
 * Format odds as a decimal
 */
export function formatOdds(odds: number): string {
  return odds.toFixed(2);
}
