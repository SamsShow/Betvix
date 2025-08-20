import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines classes with Tailwind's merge utility
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats an address for display (shortens it)
 */
export function formatAddress(address: string | null | undefined, startChars = 6, endChars = 4): string {
  if (!address) return '';
  if (address.length < startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Formats a balance with specified decimal places
 */
export function formatBalance(balance: string | number | null | undefined, decimals = 4): string {
  if (balance === null || balance === undefined) return '0';
  const num = typeof balance === 'string' ? parseFloat(balance) : balance;
  return num.toFixed(decimals);
}

/**
 * Converts from wei to ether
 */
export function fromWei(wei: string | bigint, decimals = 18): string {
  if (!wei) return '0';
  const weiBigInt = typeof wei === 'string' ? BigInt(wei) : wei;
  const divisor = BigInt(10) ** BigInt(decimals);
  const quotient = weiBigInt / divisor;
  const remainder = weiBigInt % divisor;
  const remainderString = remainder.toString().padStart(decimals, '0');
  const decimalStr = remainderString.replace(/0+$/, ''); // Remove trailing zeros
  
  if (decimalStr) {
    return `${quotient}.${decimalStr}`;
  }
  return quotient.toString();
}

/**
 * Converts from ether to wei
 */
export function toWei(ether: string | number, decimals = 18): string {
  if (!ether) return '0';
  const etherStr = ether.toString();
  if (etherStr.includes('.')) {
    const [whole, fraction] = etherStr.split('.');
    const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
    return BigInt(whole) * BigInt(10) ** BigInt(decimals) + BigInt(paddedFraction) * BigInt(10) ** BigInt(decimals - paddedFraction.length);
  }
  return (BigInt(etherStr) * BigInt(10) ** BigInt(decimals)).toString();
}

/**
 * Gets network name from chain ID
 */
export function getNetworkName(chainId: number): string {
  const networks: Record<number, string> = {
    1: 'Ethereum Mainnet',
    8453: 'Base Mainnet',
    84531: 'Base Sepolia',
    1: 'Aptos Mainnet',
    2: 'Aptos Testnet'
  };
  return networks[chainId] || 'Unknown Network';
}