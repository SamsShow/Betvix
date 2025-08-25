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

### News API Configuration

The news ingestion service requires API keys for fetching and processing news:

1. Register for a free News API key at [NewsAPI.org](https://newsapi.org/)
2. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
3. Create a `.env` file in the `services/ingestion` directory with the following:

```
PORT=3002
NEWS_API_KEY=your_news_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
ALLOWED_ORIGINS=http://localhost:3000
```

**Features:**
- NewsAPI provides real-time news data from various sources
- Gemini API enhances news articles with concise capsule summaries and prediction statements
- News data is categorized and formatted for prediction markets

> **Note**: The free tier of NewsAPI has limitations for production use. Consider upgrading to a paid plan or using alternative news APIs like GNEWS, FeedBin, etc. for production deployments.

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
