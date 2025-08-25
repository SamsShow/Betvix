"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  useAccount, 
  useConnect, 
  useDisconnect, 
  useBalance,
  type Connector
} from 'wagmi';
import { 
  useWallet as useAptosWallet,
  WalletName as AptosWalletName
} from '@aptos-labs/wallet-adapter-react';

export type ChainType = 'evm' | 'aptos' | null;

export interface WalletContextType {
  // General wallet state
  activeChain: ChainType;
  setActiveChain: (chain: ChainType) => void;
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  disconnect: () => void;
  balance: string | null;
  
  // EVM specific
  evmConnectors: readonly Connector[];
  connectEvm: (params: { connector: Connector }) => void;
  evmAddress: `0x${string}` | undefined;
  
  // Aptos specific
  aptosWallets: readonly any[];
  connectAptos: (wallet: AptosWalletName) => void;
  aptosAddress: string | undefined;
  
  // UI State
  openWalletModal: () => void;
  closeWalletModal: () => void;
  isWalletModalOpen: boolean;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  // General wallet state
  const [activeChain, setActiveChain] = useState<ChainType>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  
  // EVM Wallet state (wagmi)
  const { 
    connectors: evmConnectors,
    connect: connectEvm,
    isPending: isEvmConnecting
  } = useConnect();
  
  const { 
    address: evmAddress,
    isConnected: isEvmConnected, 
    connector: activeEvmConnector 
  } = useAccount();
  
  const { disconnect: disconnectEvm } = useDisconnect();
  const { data: evmBalance } = useBalance({
    address: evmAddress,
  });
  
  // Aptos Wallet state
  const { 
    wallets,
    connect: connectAptos, 
    account: aptosAccount,
    connected: isAptosConnected,
    isLoading: isAptosConnecting,
    disconnect: disconnectAptos
  } = useAptosWallet();
  
  // Ensure aptosWallets is always an array
  const aptosWallets = wallets || [];
  
  const aptosAddress = aptosAccount?.address;
  
  // Combined state
  const isConnected = isEvmConnected || isAptosConnected;
  const isConnecting = isEvmConnecting || isAptosConnecting;
  // Handle the address according to chain type
  const address: string | null = activeChain === 'evm' ? 
    evmAddress !== undefined ? evmAddress : null : 
    aptosAddress !== undefined ? aptosAddress : null;
  
  useEffect(() => {
    // Auto-detect which chain is connected
    if (isEvmConnected) {
      setActiveChain('evm');
    } else if (isAptosConnected) {
      setActiveChain('aptos');
    } else {
      setActiveChain(null);
    }
  }, [isEvmConnected, isAptosConnected]);
  
  // Update balance based on active chain
  useEffect(() => {
    if (activeChain === 'evm' && evmBalance) {
      setBalance(`${parseFloat(evmBalance.formatted).toFixed(4)} ${evmBalance.symbol}`);
    } else if (activeChain === 'aptos' && aptosAccount) {
      // Fetch Aptos balance - in a real implementation, you'd fetch this from the chain
      // For now we'll use a placeholder
      setBalance('0.0000 APT'); // This should be replaced with actual balance fetching
    } else {
      setBalance(null);
    }
  }, [activeChain, evmBalance, aptosAccount]);
  
  // Disconnect from any wallet
  const disconnect = () => {
    if (activeChain === 'evm') {
      disconnectEvm();
    } else if (activeChain === 'aptos') {
      disconnectAptos();
    }
    setActiveChain(null);
  };

  // Wallet modal controls
  const openWalletModal = () => setIsWalletModalOpen(true);
  const closeWalletModal = () => setIsWalletModalOpen(false);
  
  const value = {
    activeChain,
    setActiveChain,
    address,
    isConnected,
    isConnecting,
    disconnect,
    balance,
    
    // EVM specific
    evmConnectors,
    connectEvm,
    evmAddress,
    
    // Aptos specific
    aptosWallets,
    connectAptos,
    aptosAddress,
    
    // UI State
    openWalletModal,
    closeWalletModal,
    isWalletModalOpen
  };
  
  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
