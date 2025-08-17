# BetCaps

BetCaps is a multi-chain, on-chain prediction platform that converts real-world news into binary prediction markets, deployed on Base (EVM) and Aptos (Move).

## Overview

BetCaps creates a two-tap prediction experience from "news capsule → bet" with clear, deterministic market resolution. Users can make predictions on current events with low fees and low latency, supporting micro-stakes via USDC.

## Key Features

- Binary prediction markets based on news capsules
- Multi-chain deployment (Base + Aptos)
- CPMM-based pricing model
- Mobile-first PWA with wallet connect
- Automated news ingestion and market creation
- Deterministic market resolution

## Project Structure

```
├── apps/
│   ├── web/          # React + Tailwind PWA
│   └── api/          # Backend API gateway
├── contracts/
│   ├── evm/          # Solidity contracts for Base
│   └── move/         # Move modules for Aptos
├── services/
│   ├── ingestion/    # News fetching service
│   ├── nlp/          # Summarizer service  
│   ├── indexer/      # Chain data indexer
│   └── quote/        # Quote service
└── packages/         # Shared libraries
```

## Getting Started

### Prerequisites

- Node.js 18+
- PNPM
- Hardhat
- Aptos CLI
- Docker

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/betcaps.git
cd betcaps

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
```

### Development

```bash
# Start development servers
pnpm dev

# Compile contracts
pnpm contracts:compile

# Run tests
pnpm test
```

## Deployment

### Contracts

```bash
# Deploy to Base Sepolia
pnpm deploy:base-testnet

# Deploy to Aptos Testnet
pnpm deploy:aptos-testnet
```

### Frontend

```bash
# Build the web app
pnpm build:web

# Deploy to Vercel
pnpm deploy:web
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
