"use client";

import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { 
  WagmiProvider, 
  createConfig,
  http
} from 'wagmi';
import { base, baseSepolia } from 'viem/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { PetraWallet } from 'petra-plugin-wallet-adapter';
import { WalletProvider } from '@/contexts/WalletContext';

// Create a new query client for React Query
const queryClient = new QueryClient();

// Configure wagmi client
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';

const metadata = {
  name: 'Betvix',
  description: 'Multi-chain prediction markets platform',
  url: 'https://betvix.com',
  icons: ['https://betvix.com/favicon.ico']
};

// Configure chains based on environment
const chains = process.env.NODE_ENV === 'production' 
  ? [base]
  : [baseSepolia];

// Configure wagmi client
const config = createConfig({
  chains,
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  connectors: [
    injected({ target: 'metaMask' }),
    walletConnect({ projectId }),
    coinbaseWallet({ appName: metadata.name })
  ],
});

// Configure web3modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  chains,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#10b981',
    '--w3m-accent-fill-color': '#ffffff',
    '--w3m-accent-color': '#10b981',
    '--w3m-background-color': '#18181b',
    '--w3m-overlay-background-color': 'rgba(24, 24, 27, 0.8)',
    '--w3m-container-border-radius': '12px',
    '--w3m-wallet-icon-border-radius': '8px',
    '--w3m-border-radius-master': '12px'
  }
});

// Configure Aptos wallets
const aptosWallets = [
  // Use the PetraWallet directly, not as a constructor
  PetraWallet
  // Add more Aptos wallets here as needed
];

export function WalletProviders({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AptosWalletAdapterProvider plugins={aptosWallets} autoConnect={false}>
          <WalletProvider>
            {children}
          </WalletProvider>
        </AptosWalletAdapterProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}