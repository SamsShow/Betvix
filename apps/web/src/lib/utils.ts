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
  // Calculate divisor manually since ** operator may not be supported for BigInt
  let divisor = BigInt(1);
  for (let i = 0; i < decimals; i++) {
    divisor = divisor * BigInt(10);
  }
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
    // Calculate powers manually since ** operator may not be supported for BigInt
    let wholePower = BigInt(1);
    for (let i = 0; i < decimals; i++) {
      wholePower = wholePower * BigInt(10);
    }
    
    let fractionPower = BigInt(1);
    for (let i = 0; i < (decimals - paddedFraction.length); i++) {
      fractionPower = fractionPower * BigInt(10);
    }
    
    return (BigInt(whole) * wholePower + BigInt(paddedFraction) * fractionPower).toString();
  }
  // Calculate power manually since ** operator may not be supported for BigInt
  let power = BigInt(1);
  for (let i = 0; i < decimals; i++) {
    power = power * BigInt(10);
  }
  return (BigInt(etherStr) * power).toString();
}

/**
 * Gets network name from chain ID
 */
export function getNetworkName(chainId: number): string {
  const networks: Record<number, string> = {
    1: 'Ethereum Mainnet',
    8453: 'Base Mainnet',
    84531: 'Base Sepolia',
    10001: 'Aptos Mainnet',
    10002: 'Aptos Testnet'
  };
  return networks[chainId] || 'Unknown Network';
}