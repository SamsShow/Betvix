"use client";

import React, { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { 
  WalletIcon, 
  ChevronDownIcon,
  ArrowLeftOnRectangleIcon,
  ClipboardIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export const WalletStatus = () => {
  const { 
    activeChain,
    address,
    isConnected,
    balance,
    disconnect,
    openWalletModal,
  } = useWallet();
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Format address for display
  const formatAddress = (addr: string | null | undefined) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };
  
  // Copy address to clipboard
  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  // Handle wallet connect click
  const handleConnectClick = () => {
    openWalletModal();
  };
  
  if (!isConnected) {
    return (
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center justify-center px-5 py-2.5 bg-accent-primary text-white font-medium rounded-xl transition-all duration-300"
        onClick={handleConnectClick}
      >
        <WalletIcon className="w-4 h-4 mr-2" />
        Connect Wallet
      </motion.button>
    );
  }
  
  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center justify-center px-3 py-2 bg-background-secondary/70 border border-background-tertiary/30 rounded-xl transition-all"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="flex items-center">
          {/* Chain indicator */}
          <div 
            className={`w-2 h-2 rounded-full mr-2 ${
              activeChain === 'evm' 
                ? 'bg-accent-primary' 
                : activeChain === 'aptos' 
                ? 'bg-accent-neon'
                : 'bg-text-tertiary'
            }`}
          />
          
          {/* Address */}
          <span className="mr-1 font-medium">
            {formatAddress(address)}
          </span>
          
          <ChevronDownIcon className="w-4 h-4" />
        </div>
      </motion.button>
      
      {/* Dropdown */}
      {showDropdown && (
        <div 
          className="absolute right-0 mt-2 w-64 bg-background-card border border-background-tertiary/20 rounded-xl shadow-lg p-3 z-50"
          onMouseLeave={() => setShowDropdown(false)}
        >
          {/* Network + Address */}
          <div className="mb-3 pb-3 border-b border-background-tertiary/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div 
                  className={`w-2 h-2 rounded-full mr-2 ${
                    activeChain === 'evm' 
                      ? 'bg-accent-primary' 
                      : activeChain === 'aptos' 
                      ? 'bg-accent-neon'
                      : 'bg-text-tertiary'
                  }`}
                />
                <span className="text-sm font-medium">
                  {activeChain === 'evm' ? 'Base' : activeChain === 'aptos' ? 'Aptos' : 'Unknown'}
                </span>
              </div>
              {activeChain === 'evm' && (
                <span className="text-xs bg-accent-primary/20 text-accent-primary px-2 py-0.5 rounded">EVM</span>
              )}
              {activeChain === 'aptos' && (
                <span className="text-xs bg-accent-neon/20 text-accent-neon px-2 py-0.5 rounded">Move</span>
              )}
            </div>
            
            {/* Address */}
            <div className="flex items-center justify-between bg-background-secondary/40 rounded-lg px-2 py-1.5">
              <span className="text-sm text-text-secondary font-mono">
                {formatAddress(address)}
              </span>
              <button 
                onClick={copyToClipboard}
                className="text-text-tertiary hover:text-text-primary transition-colors"
              >
                {copied ? (
                  <CheckIcon className="w-4 h-4 text-accent-green" />
                ) : (
                  <ClipboardIcon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          
          {/* Balance */}
          <div className="mb-3 pb-3 border-b border-background-tertiary/20">
            <span className="text-sm text-text-secondary block mb-1">Balance</span>
            <div className="font-medium">
              {balance || '0.0000'}
            </div>
          </div>
          
          {/* Actions */}
          <div className="space-y-2">
            <button 
              onClick={() => openWalletModal()}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-background-secondary/50 transition-colors"
            >
              <span className="text-sm">Change Wallet</span>
              <WalletIcon className="w-4 h-4 text-text-tertiary" />
            </button>
            
            <button 
              onClick={disconnect}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-background-secondary/50 text-market-red transition-colors"
            >
              <span className="text-sm">Disconnect</span>
              <ArrowLeftOnRectangleIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
