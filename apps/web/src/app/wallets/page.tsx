"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWallet } from '@/contexts/WalletContext';
import { WalletStatus } from '@/components/wallet/WalletStatus';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function WalletsPage() {
  const { 
    activeChain,
    address,
    isConnected,
    balance,
    disconnect,
    openWalletModal
  } = useWallet();

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center">
            <Link href="/" className="mr-4 text-text-secondary hover:text-text-primary transition-colors">
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <div className="flex items-center">
              <Image
                src="/Betvix.svg"
                alt="Betvix Logo"
                width={32}
                height={32}
                className="mr-2"
              />
              <h1 className="text-headline-large font-semibold">Wallet Connect</h1>
            </div>
          </div>
          <WalletStatus />
        </div>
        
        {/* Main content */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-background-card/90 backdrop-blur-sm border border-background-tertiary/20 rounded-xl p-8 shadow-lg">
            <h2 className="text-headline-medium font-semibold mb-8 text-center">Connect Your Wallet</h2>
            
            {isConnected ? (
              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-background-secondary/30 border border-background-tertiary/20">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-text-secondary mb-1">Connected Chain</p>
                      <div className="flex items-center">
                        <div 
                          className={`w-3 h-3 rounded-full mr-2 ${
                                          activeChain === 'evm' 
                ? 'bg-accent-primary' 
                : activeChain === 'aptos' 
                ? 'bg-accent-neon'
                              : 'bg-text-tertiary'
                          }`}
                        />
                        <span className="font-medium">
                          {activeChain === 'evm' ? 'Base (EVM)' : activeChain === 'aptos' ? 'Aptos' : 'Unknown Chain'}
                        </span>
                        
                        {activeChain && (
                          <span 
                            className={`ml-2 text-xs px-2 py-0.5 rounded ${
                              activeChain === 'evm' 
                                ? 'bg-market-blue/10 text-market-blue' 
                                : 'bg-accent-neon/10 text-accent-neon'
                            }`}
                          >
                            {activeChain === 'evm' ? 'EVM' : 'Move'}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={openWalletModal}
                      className="text-sm text-accent-primary hover:text-accent-primary-dark transition-colors"
                    >
                      Change
                    </button>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-background-secondary/30 border border-background-tertiary/20">
                  <p className="text-sm text-text-secondary mb-1">Wallet Address</p>
                  <p className="font-mono text-sm break-all">{address}</p>
                </div>
                
                {balance && (
                  <div className="p-4 rounded-lg bg-background-secondary/30 border border-background-tertiary/20">
                    <p className="text-sm text-text-secondary mb-1">Balance</p>
                    <p className="font-medium text-lg">{balance}</p>
                  </div>
                )}
                
                <div className="flex justify-center pt-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-6 py-3 bg-market-red/20 text-market-red font-medium rounded-xl hover:bg-market-red/30 transition-colors"
                    onClick={disconnect}
                  >
                    Disconnect Wallet
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <p className="text-text-secondary text-center max-w-md mx-auto">
                  Connect your wallet to access prediction markets and start trading. We support both EVM-compatible and Aptos wallets.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-background-secondary/20 rounded-lg p-6 border border-background-tertiary/20">
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-market-blue/10 flex items-center justify-center">
                        <svg className="w-6 h-6 text-market-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-headline-small font-medium text-center mb-2">EVM Wallets</h3>
                    <p className="text-text-secondary text-sm text-center mb-4">
                      Connect to Base blockchain with MetaMask, WalletConnect, or Coinbase Wallet
                    </p>
                    <div className="flex justify-center">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={openWalletModal}
                        className="px-5 py-2.5 bg-accent-primary text-white font-medium rounded-xl transition-colors"
                      >
                        Connect EVM Wallet
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="bg-background-secondary/20 rounded-lg p-6 border border-background-tertiary/20">
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-accent-purple/10 flex items-center justify-center">
                        <svg className="w-6 h-6 text-accent-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-headline-small font-medium text-center mb-2">Aptos Wallets</h3>
                    <p className="text-text-secondary text-sm text-center mb-4">
                      Connect to Aptos blockchain with Petra, Martian, or other Move-compatible wallets
                    </p>
                    <div className="flex justify-center">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={openWalletModal}
                        className="px-5 py-2.5 bg-accent-neon text-white font-medium rounded-xl transition-colors"
                      >
                        Connect Aptos Wallet
                      </motion.button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center pt-4">
                  <Link href="/" className="text-text-secondary hover:text-text-primary transition-colors">
                    Return to Home
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-12 text-center">
            <h3 className="text-headline-small font-medium mb-4">Supported Wallets</h3>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { name: 'MetaMask', type: 'EVM' },
                { name: 'WalletConnect', type: 'EVM' },
                { name: 'Coinbase Wallet', type: 'EVM' },
                { name: 'Petra', type: 'Aptos' },
                { name: 'Martian', type: 'Aptos' },
                { name: 'Pontem', type: 'Aptos' }
              ].map((wallet, index) => (
                <div 
                  key={index} 
                  className="px-4 py-2 rounded-lg bg-background-secondary/30 border border-background-tertiary/20"
                >
                  <div className="flex items-center">
                    <span className="font-medium mr-2">{wallet.name}</span>
                    <span 
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        wallet.type === 'EVM' 
                          ? 'bg-market-blue/10 text-market-blue' 
                          : 'bg-accent-purple/10 text-accent-purple'
                      }`}
                    >
                      {wallet.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
