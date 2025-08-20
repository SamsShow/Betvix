"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useWallet, ChainType } from '@/contexts/WalletContext';
import { 
  WalletIcon, 
  XMarkIcon, 
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { Tab } from '@headlessui/react';
import { cn } from '@/lib/utils';

export const WalletModal = () => {
  const { 
    isWalletModalOpen, 
    closeWalletModal,
    evmConnectors,
    connectEvm,
    aptosWallets,
    connectAptos,
    isConnecting
  } = useWallet();
  
  const [activeTab, setActiveTab] = useState<ChainType>('evm');
  
  // Handle EVM wallet connection
  const handleConnectEvm = (connectorId: string) => {
    const connector = evmConnectors.find(c => c.id === connectorId);
    if (connector) {
      connectEvm({ connector });
      closeWalletModal();
    }
  };
  
  // Handle Aptos wallet connection
  const handleConnectAptos = (walletName: string) => {
    connectAptos(walletName);
    closeWalletModal();
  };
  
  if (!isWalletModalOpen) return null;
  
  // Wallet options for EVM
  const evmWalletOptions = [
    {
      id: 'metaMask',
      name: 'MetaMask',
      icon: '/wallet-icons/metamask.svg',
      description: 'Connect to your MetaMask wallet',
    },
    {
      id: 'walletConnect',
      name: 'WalletConnect',
      icon: '/wallet-icons/walletconnect.svg',
      description: 'Connect with WalletConnect',
    },
    {
      id: 'coinbaseWallet',
      name: 'Coinbase Wallet',
      icon: '/wallet-icons/coinbase.svg',
      description: 'Connect to your Coinbase wallet',
    }
  ];
  
  // Wallet options for Aptos
  const aptosWalletOptions = [
    {
      id: 'petra',
      name: 'Petra',
      icon: '/wallet-icons/petra.svg',
      description: 'Connect to Petra wallet',
    },
    {
      id: 'martian',
      name: 'Martian',
      icon: '/wallet-icons/martian.svg',
      description: 'Connect to Martian wallet',
    },
    {
      id: 'pontem',
      name: 'Pontem',
      icon: '/wallet-icons/pontem.svg',
      description: 'Connect to Pontem wallet',
    }
  ];
  
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-background-card border border-background-tertiary/20 rounded-2xl p-6 w-full max-w-md shadow-xl"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-headline-medium font-semibold flex items-center">
              <WalletIcon className="w-5 h-5 mr-2" />
              Connect Wallet
            </h3>
            <button 
              onClick={closeWalletModal}
              className="p-2 rounded-full hover:bg-background-secondary/50 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          
          {/* Tab Selection */}
          <Tab.Group onChange={(index) => setActiveTab(index === 0 ? 'evm' : 'aptos')}>
            <Tab.List className="flex rounded-xl bg-background-secondary/20 p-1 mb-6">
              <Tab
                className={({ selected }) => cn(
                  'w-full rounded-lg py-2.5 text-sm font-medium transition-all',
                  'focus:outline-none',
                  selected 
                    ? 'bg-background-card shadow text-accent-purple' 
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                Base (EVM)
              </Tab>
              <Tab
                className={({ selected }) => cn(
                  'w-full rounded-lg py-2.5 text-sm font-medium transition-all',
                  'focus:outline-none',
                  selected 
                    ? 'bg-background-card shadow text-accent-purple' 
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                Aptos
              </Tab>
            </Tab.List>
            
            <Tab.Panels>
              {/* EVM Wallets */}
              <Tab.Panel>
                <div className="space-y-3">
                  {evmWalletOptions.map((wallet) => (
                    <button
                      key={wallet.id}
                      onClick={() => handleConnectEvm(wallet.id)}
                      disabled={isConnecting}
                      className="w-full flex items-center p-3 rounded-xl hover:bg-background-secondary/30 border border-background-tertiary/20 transition-colors"
                    >
                      <div className="w-10 h-10 flex items-center justify-center rounded-md overflow-hidden bg-background-secondary/30 mr-3">
                        <Image 
                          src={wallet.icon}
                          alt={`${wallet.name} icon`}
                          width={24}
                          height={24}
                        />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium">{wallet.name}</p>
                        <p className="text-text-secondary text-sm">{wallet.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </Tab.Panel>
              
              {/* Aptos Wallets */}
              <Tab.Panel>
                <div className="space-y-3">
                  {aptosWalletOptions.map((wallet) => (
                    <button
                      key={wallet.id}
                      onClick={() => handleConnectAptos(wallet.id)}
                      disabled={isConnecting}
                      className="w-full flex items-center p-3 rounded-xl hover:bg-background-secondary/30 border border-background-tertiary/20 transition-colors"
                    >
                      <div className="w-10 h-10 flex items-center justify-center rounded-md overflow-hidden bg-background-secondary/30 mr-3">
                        <Image 
                          src={wallet.icon}
                          alt={`${wallet.name} icon`}
                          width={24}
                          height={24}
                        />
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-medium">{wallet.name}</p>
                        <p className="text-text-secondary text-sm">{wallet.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
          
          {/* Loading State */}
          {isConnecting && (
            <div className="mt-4 flex items-center justify-center text-text-secondary">
              <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
              <span>Connecting...</span>
            </div>
          )}
          
          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-background-tertiary/20">
            <p className="text-text-tertiary text-sm text-center">
              By connecting your wallet, you agree to our{' '}
              <a href="#" className="text-accent-purple hover:underline">Terms of Service</a>
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
