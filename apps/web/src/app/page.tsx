"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { CapsuleCard } from '@/components/ui/CapsuleCard';
import { WalletStatus } from '@/components/wallet/WalletStatus';
import { useWallet } from '@/contexts/WalletContext';
import { 
  GlobeAltIcon, 
  SparklesIcon, 
  BoltIcon, 
  ShieldCheckIcon,
  CreditCardIcon,
  MagnifyingGlassIcon,
  TrophyIcon,
  ArrowRightIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  // Animation refs
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Sample market data (reusing from original)
  const sampleMarkets = [
    {
      id: '1',
      title: 'Will BTC hit $100k in 2024?',
      lines: [
        'Bitcoin price prediction based on market trends',
        'Consider recent ETF approvals and halving cycle'
      ],
      deadline: new Date('2024-12-31'),
      odds: {
        yes: 0.62,
        no: 0.38
      },
      status: 'open' as const
    },
    {
      id: '2',
      title: 'Will SEC approve ETH ETF in 2024?',
      lines: [
        'SEC considering ETH ETF applications',
        'Decision expected by Q3 2024'
      ],
      deadline: new Date('2024-09-30'),
      odds: {
        yes: 0.45,
        no: 0.55
      },
      status: 'open' as const
    },
    {
      id: '3',
      title: 'Will Fed cut rates in June 2024?',
      lines: [
        'Federal Reserve monetary policy decision',
        'Inflation and employment metrics to watch'
      ],
      deadline: new Date('2024-06-15'),
      odds: {
        yes: 0.78,
        no: 0.22
      },
      status: 'open' as const
    }
  ];
  
  // Features data with proper icons
  const features = [
    {
      title: "Multi-Chain Support",
      description: "Trade seamlessly across Base (EVM) and Aptos (Move) blockchains with unified liquidity",
      icon: <GlobeAltIcon className="w-6 h-6" />,
      color: "from-accent-purple to-market-blue"
    },
    {
      title: "AI-Powered Markets",
      description: "News events automatically converted to prediction markets using advanced NLP",
      icon: <SparklesIcon className="w-6 h-6" />,
      color: "from-market-blue to-accent-green"
    },
    {
      title: "Instant Quotes",
      description: "Lightning-fast price quotes and trade execution under 5 seconds",
      icon: <BoltIcon className="w-6 h-6" />,
      color: "from-accent-green to-market-yellow"
    },
    {
      title: "Secure & Transparent",
      description: "Fully on-chain trading with verifiable markets and auditable outcomes",
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      color: "from-market-yellow to-market-red"
    }
  ];

  // Mock Google login
  const handleGoogleLogin = () => {
    // In a real implementation, this would integrate with Google OAuth
    console.log("Google login clicked");
    setIsLoggedIn(true);
    setShowAuthModal(false);
  };
  
  // Mock logout
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Auth modal component
  const AuthModal = () => {
    if (!showAuthModal) return null;
    
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-background-card border border-background-tertiary/20 rounded-xl p-6 w-full max-w-md"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-headline-medium font-semibold">Sign In</h3>
            <button 
              onClick={() => setShowAuthModal(false)}
              className="p-2 rounded-full hover:bg-background-secondary/50"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <p className="text-text-secondary mb-6">
            Sign in to access your prediction markets, track your portfolio, and connect your wallet.
          </p>
          
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full px-4 py-3 border border-background-tertiary/30 rounded-lg hover:bg-background-secondary/30 transition-colors mb-4"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </button>
          
          <div className="text-center text-sm text-text-tertiary">
            By signing in, you agree to our <a href="#" className="text-accent-purple hover:underline">Terms of Service</a> and <a href="#" className="text-accent-purple hover:underline">Privacy Policy</a>.
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-primary via-accent-neon to-accent-primary-dark animate-gradient-slow"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-background to-background"></div>
      </div>

      {/* Auth modal */}
      <AnimatePresence>
        {showAuthModal && <AuthModal />}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-background-tertiary/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/Betvix.svg"
                  alt="Betvix Logo"
                  width={32} 
                  height={32} 
                  className="mr-2"
                />
                <span className="text-headline-medium font-semibold text-text-primary">Betvix</span>
              </Link>
              <nav className="hidden md:flex space-x-6 ml-8">
                <Link href="/" className="text-body-medium font-medium text-text-primary hover:text-accent-purple transition-colors">Home</Link>
                <Link href="/markets" className="text-body-medium font-medium text-text-secondary hover:text-text-primary transition-colors">Markets</Link>
                <Link href="/portfolio" className="text-body-medium font-medium text-text-secondary hover:text-text-primary transition-colors">Portfolio</Link>
                <Link href="#" className="text-body-medium font-medium text-text-secondary hover:text-text-primary transition-colors">About</Link>
              </nav>
            </div>
            
            <div className="flex items-center gap-3">
                            {isLoggedIn ? (
                <>
                  <WalletStatus />
                  
                  <div className="relative group">
                    <button className="p-2 rounded-full hover:bg-background-secondary/50 text-text-primary">
                      <UserCircleIcon className="w-6 h-6" />
                    </button>
                    <div className="absolute right-0 top-full mt-1 w-48 bg-background-card border border-background-tertiary/20 rounded-xl shadow-md p-2 hidden group-hover:block">
                      <Link href="/profile" className="block px-4 py-2 rounded-lg hover:bg-background-secondary/50 transition-colors">
                        Profile
                      </Link>
                      <Link href="/settings" className="block px-4 py-2 rounded-lg hover:bg-background-secondary/50 transition-colors">
                        Settings
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 rounded-lg hover:bg-background-secondary/50 text-market-red transition-colors"
                      >
                        Sign Out
                </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <motion.button 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAuthModal(true)}
                    className="hidden md:flex items-center justify-center px-5 py-2.5 bg-background-secondary/50 border border-background-tertiary/30 text-text-primary font-medium rounded-xl hover:bg-background-tertiary/10 transition-all duration-300"
                  >
                    Sign In
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAuthModal(true)}
                    className="flex items-center justify-center px-5 py-2.5 bg-accent-primary text-white font-medium rounded-xl transition-all duration-300"
                  >
                    Register
                    <ArrowRightIcon className="ml-2 w-4 h-4" />
                  </motion.button>
                  
                  <button 
                    onClick={() => setShowAuthModal(true)}
                    className="md:hidden p-2 rounded-full hover:bg-background-secondary/50 text-text-primary"
                  >
                    <UserCircleIcon className="w-6 h-6" />
                </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section with cleaner design */}
      <section ref={heroRef} className="relative z-10 pt-16 md:pt-24 pb-24 md:pb-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-16">
            {/* Hero Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex-1"
            >
              <h1 className="text-display-medium md:text-display-large lg:text-6xl font-semibold leading-tight mb-6">
                The future of <span className="text-accent-primary">prediction markets</span>
              </h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="text-body-medium md:text-body-large text-text-secondary max-w-xl mb-8"
              >
                Convert real-world events into engaging binary markets. Powered by AI, secured by multi-chain technology.
              </motion.p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => !isLoggedIn && setShowAuthModal(true)}
                  className="px-6 md:px-8 py-3 md:py-4 bg-accent-primary text-white font-medium text-body-medium rounded-xl transition-all duration-300"
                >
                  {isLoggedIn ? 'Start Trading' : 'Sign Up & Trade'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03, backgroundColor: "#334155" }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 md:px-8 py-3 md:py-4 bg-background-secondary/50 border border-background-tertiary/30 text-text-primary font-medium text-body-medium rounded-xl hover:bg-background-tertiary/10 transition-all duration-300"
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>
            
            {/* Hero Visual */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="flex-1 w-full"
            >
              <div className="relative w-full h-[280px] md:h-[420px]">
                {/* Subtle gradient shapes */}
                <div className="absolute top-10 right-10 w-48 md:w-64 h-48 md:h-64 bg-accent-purple/10 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute bottom-10 left-10 md:left-20 w-40 md:w-56 h-40 md:h-56 bg-market-blue/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 left-10 w-36 md:w-48 h-36 md:h-48 bg-accent-green/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
                
                {/* Floating market cards */}
                <motion.div 
                  initial={{ y: 0 }}
                  animate={{ y: [-8, 8, -8] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  className="absolute top-10 left-0 w-full max-w-xs md:max-w-sm transform -rotate-2"
                >
                  <div className="bg-background-card/95 backdrop-blur border border-background-tertiary/20 rounded-2xl p-4 md:p-5 shadow-lg">
                    <h3 className="text-headline-small font-bold mb-2">BTC to $100k?</h3>
                    <div className="flex justify-between mb-3">
                      <span className="text-text-secondary text-sm md:text-base">Current odds:</span>
                      <span className="font-medium text-accent-green">Yes: 62%</span>
                    </div>
                    <div className="w-full bg-background-secondary/50 rounded-full h-2">
                      <div className="bg-accent-primary h-2 rounded-full" style={{ width: '62%' }}></div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ y: 0 }}
                  animate={{ y: [8, -8, 8] }}
                  transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
                  className="absolute top-48 md:top-60 right-0 w-full max-w-xs md:max-w-sm transform rotate-2"
                >
                  <div className="bg-background-card/95 backdrop-blur border border-background-tertiary/20 rounded-2xl p-4 md:p-5 shadow-lg">
                    <h3 className="text-headline-small font-bold mb-2">Fed Rate Cut?</h3>
                    <div className="flex justify-between mb-3">
                      <span className="text-text-secondary text-sm md:text-base">Current odds:</span>
                      <span className="font-medium text-accent-green">Yes: 78%</span>
                    </div>
                    <div className="w-full bg-background-secondary/50 rounded-full h-2">
                      <div className="bg-accent-primary h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Floating crypto icons - simplified */}
                <motion.div 
                  animate={{ 
                    y: [0, -12, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                  className="absolute top-40 left-32 md:left-40 w-12 md:w-14 h-12 md:h-14 bg-accent-primary/80 rounded-full flex items-center justify-center text-lg md:text-xl shadow-md"
                >
                  ₿
                </motion.div>
                
                <motion.div 
                  animate={{ 
                    y: [0, 12, 0],
                    rotate: [0, -5, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 }}
                  className="absolute bottom-20 md:bottom-40 right-20 md:right-40 w-12 md:w-14 h-12 md:h-14 bg-accent-neon/80 rounded-full flex items-center justify-center text-lg md:text-xl shadow-md"
                >
                  Ξ
                </motion.div>
            </div>
            </motion.div>
          </div>
            </div>
            
        {/* Stats bar - simplified and responsive */}
        <div className="mt-16 md:mt-20 py-8 md:py-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <p className="text-display-small font-semibold text-accent-primary">$12M+</p>
                <p className="text-text-secondary text-sm md:text-base">Trading Volume</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-center"
              >
                <p className="text-display-small font-semibold text-accent-purple">500+</p>
                <p className="text-text-secondary text-sm md:text-base">Markets Created</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center"
              >
                <p className="text-display-small font-semibold text-accent-purple">5,000+</p>
                <p className="text-text-secondary text-sm md:text-base">Active Users</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-center"
              >
                <p className="text-display-small font-semibold text-accent-purple">2</p>
                <p className="text-text-secondary text-sm md:text-base">Blockchains</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section - cleaner design and responsive */}
      <section ref={featuresRef} className="relative z-10 py-16 md:py-20 bg-background-card/30 backdrop-blur-sm border-y border-background-tertiary/10">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-display-small md:text-display-medium font-semibold mb-3">Powerful Features</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Our platform combines blockchain technology with AI to create a seamless prediction market experience.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  y: -4,
                  transition: { duration: 0.2 }
                }}
                className="bg-background-card/95 backdrop-blur-sm border border-background-tertiary/20 rounded-xl p-5 md:p-6 hover:shadow-md transition-all duration-300"
              >
                <div className="mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-accent-primary/10 flex items-center justify-center text-accent-primary">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-headline-small md:text-headline-medium font-semibold mb-2">{feature.title}</h3>
                <p className="text-text-secondary text-sm md:text-base">{feature.description}</p>
              </motion.div>
            ))}
        </div>
      </div>
      </section>
      
      {/* Market Preview Section - cleaner and responsive */}
      <section className="relative z-10 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-display-small md:text-display-medium font-semibold mb-3">Trending Markets</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Explore our most active prediction markets powered by real-world events and AI analysis.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <AnimatePresence>
              {sampleMarkets.map((market, index) => (
                <motion.div
                  key={market.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    y: -8,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Link href={`/markets/${market.id}`}>
            <CapsuleCard 
              title={market.title}
              lines={market.lines}
              deadline={market.deadline}
              odds={market.odds}
              status={market.status}
            />
          </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <div className="flex justify-center mt-10 md:mt-12">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-3 md:px-6 md:py-3 bg-accent-primary text-white font-medium rounded-xl transition-all duration-300"
            >
              View All Markets
              <ArrowRightIcon className="ml-2 w-4 h-4 inline" />
            </motion.button>
          </div>
        </div>
      </section>
      
      {/* How It Works - cleaner and responsive */}
      <section className="relative z-10 py-16 md:py-20 bg-background-card/30 backdrop-blur-sm border-y border-background-tertiary/10">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-display-small md:text-display-medium font-semibold mb-3">How It Works</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Simple steps to start trading on prediction markets with Betvix.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { 
                title: "Connect Wallet", 
                description: "Link your wallet to our platform with just a click. We support MetaMask, Coinbase Wallet, and more.",
                icon: <CreditCardIcon className="w-6 h-6" />,
                delay: 0 
              },
              { 
                title: "Choose a Market", 
                description: "Browse our extensive selection of prediction markets or create your own based on real-world events.",
                icon: <MagnifyingGlassIcon className="w-6 h-6" />,
                delay: 0.1
              },
              { 
                title: "Trade & Win", 
                description: "Place your predictions with instant price quotes and collect winnings when markets resolve.",
                icon: <TrophyIcon className="w-6 h-6" />,
                delay: 0.2
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: step.delay }}
                className="relative"
              >
                <div className="bg-background-card/95 backdrop-blur-sm border border-background-tertiary/20 rounded-xl p-5 md:p-6 h-full">
                  <div className="mb-5 w-10 h-10 md:w-12 md:h-12 rounded-lg bg-accent-purple/10 flex items-center justify-center text-accent-purple">
                    {step.icon}
                  </div>
                  <h3 className="text-headline-small md:text-headline-medium font-semibold mb-3">{step.title}</h3>
                  <p className="text-text-secondary text-sm md:text-base">{step.description}</p>
                </div>
                
                {/* Connector line - visible only on desktop */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-[1px] bg-background-tertiary/30">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-accent-primary rounded-full"></div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section - cleaner and responsive */}
      <section className="relative z-10 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-background-card/80 backdrop-blur-sm border border-background-tertiary/20 rounded-xl p-8 md:p-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Image 
                src="/Betvix.svg"
                alt="Betvix Logo"
                width={64} 
                height={64}
                className="mx-auto mb-6" 
              />
              
              <h2 className="text-display-small md:text-display-medium font-semibold mb-4">
                Ready to Start Predicting?
              </h2>
              
              <p className="text-body-medium md:text-body-large text-text-secondary mb-8 max-w-lg mx-auto">
                Join thousands of traders on the cutting-edge of prediction markets. Start with as little as $5 worth of crypto.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => !isLoggedIn && setShowAuthModal(true)}
                  className="px-6 py-3 md:px-8 md:py-4 bg-accent-purple text-white font-medium text-body-medium rounded-xl transition-all duration-300"
                >
                  {isLoggedIn ? 'Get Started Now' : 'Sign Up Now'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 md:px-8 md:py-4 bg-background-secondary/50 border border-background-tertiary/30 text-text-primary font-medium text-body-medium rounded-xl hover:bg-background-tertiary/10 transition-all duration-300"
                >
                  View Documentation
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Footer - cleaner and responsive */}
      <footer className="relative z-10 bg-background-card/30 backdrop-blur-sm border-t border-background-tertiary/10 pt-12 md:pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-10 md:mb-12">
            <div>
              <div className="flex items-center mb-5 md:mb-6">
                <Image 
                  src="/Betvix.svg"
                  alt="Betvix Logo"
                  width={28} 
                  height={28} 
                  className="mr-2"
                />
                <span className="text-headline-medium font-semibold text-text-primary">Betvix</span>
              </div>
              <p className="text-text-secondary text-sm md:text-base mb-5 md:mb-6">
                The next generation of prediction markets, powered by blockchain technology and AI.
              </p>
              <div className="flex space-x-4">
                {["Twitter", "Discord", "Telegram", "GitHub"].map((social, i) => (
                  <a key={i} href="#" className="text-text-secondary hover:text-accent-purple transition-colors text-sm">
                    {social}
                  </a>
                ))}
              </div>
            </div>
            
            {[
              {
                title: "Product",
                links: ["Markets", "Portfolio", "Analytics", "API Access"]
              },
              {
                title: "Resources",
                links: ["Documentation", "Tutorials", "Blog", "FAQ"]
              },
              {
                title: "Company",
                links: ["About Us", "Careers", "Contact", "Press Kit"]
              }
            ].map((column, i) => (
              <div key={i}>
                <h4 className="text-headline-small font-medium mb-4">{column.title}</h4>
                <ul className="space-y-2">
                  {column.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-text-secondary hover:text-text-primary transition-colors text-sm md:text-base">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-background-tertiary/10 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-text-tertiary text-xs md:text-sm mb-4 md:mb-0">
              © 2023 Betvix. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-text-tertiary hover:text-text-secondary text-xs md:text-sm transition-colors">Terms</a>
              <a href="#" className="text-text-tertiary hover:text-text-secondary text-xs md:text-sm transition-colors">Privacy</a>
              <a href="#" className="text-text-tertiary hover:text-text-secondary text-xs md:text-sm transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}