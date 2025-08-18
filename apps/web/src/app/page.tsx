"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { CapsuleCard } from '@/components/ui/CapsuleCard';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { QuickActionDrawer } from '@/components/ui/QuickActionDrawer';

export default function Home() {
  const [votes, setVotes] = useState<Record<string, 'yes' | 'no' | undefined>>({});
  const [segment, setSegment] = useState<string>('All');
  const [query, setQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'trending' | 'volume' | 'ending'>('trending');
  // Sample market data for illustration
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

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background border-b border-background-tertiary">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-headline-medium font-bold">Betvix</h1>
              <nav className="hidden md:flex space-x-4 ml-8">
                <Link href="/" className="text-body-medium font-medium text-accent-purple">Trending</Link>
                <Link href="/markets" className="text-body-medium font-medium text-text-secondary hover:text-text-primary">Markets</Link>
                <Link href="/portfolio" className="text-body-medium font-medium text-text-secondary hover:text-text-primary">Portfolio</Link>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative w-72 hidden md:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-text-tertiary">
                    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search markets..."
                  className="w-full bg-background-secondary border border-background-tertiary rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-accent-purple text-sm"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <button className="hidden md:flex items-center justify-center px-4 py-2 bg-accent-purple hover:bg-accent-purple-dark text-white rounded-lg transition-colors">
                  Connect Wallet
                </button>
                <button className="p-2 rounded-full hover:bg-background-secondary">
                  <span className="sr-only">User menu</span>
                  <div className="h-8 w-8 rounded-full bg-background-tertiary flex items-center justify-center">
                    <span>👤</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero section with page title and search for mobile */}
      <div className="bg-gradient-to-b from-background-secondary/50 to-background py-8 px-4">
        <div className="container mx-auto">
          <h2 className="text-display-small font-bold mb-4">Today's Trending Markets</h2>
          <p className="text-text-secondary mb-6 max-w-2xl">AI-generated prediction markets based on real-world news and events</p>
          
          <div className="md:hidden relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-text-tertiary">
                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search markets..."
              className="w-full bg-background-secondary border border-background-tertiary rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-accent-purple text-sm"
            />
          </div>

          {/* Filter controls */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <SegmentedControl 
                options={["All", "Crypto", "Politics", "Finance", "Tech"]}
                value={segment}
                onChange={setSegment}
                className="md:w-auto"
              />
            </div>
            
            <div className="flex items-center ml-auto">
              <span className="text-text-secondary text-sm mr-2">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-background-secondary border border-background-tertiary rounded-lg p-2 text-sm focus:outline-none focus:border-accent-purple"
              >
                <option value="trending">Trending</option>
                <option value="volume">Volume</option>
                <option value="ending">Ending Soon</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Markets grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleMarkets
          .filter(m => segment === 'All' || m.title.toLowerCase().includes(segment.toLowerCase()))
          .filter(m => !query || m.title.toLowerCase().includes(query.toLowerCase()) || m.lines.some(l => l.toLowerCase().includes(query.toLowerCase())))
          .map(market => (
          <Link key={market.id} href={`/markets/${market.id}`}>
            <CapsuleCard 
              title={market.title}
              lines={market.lines}
              deadline={market.deadline}
              odds={market.odds}
              status={market.status}
              selectedSide={votes[market.id]}
              onVote={(side) => setVotes(prev => ({ ...prev, [market.id]: side }))}
            />
          </Link>
        ))}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-background-tertiary bg-background z-50">
        <div className="flex items-center justify-around h-16">
          <Link href="/" className="flex flex-col items-center justify-center text-accent-purple">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs font-medium mt-1">Home</span>
          </Link>
          
          <Link href="/markets" className="flex flex-col items-center justify-center text-text-tertiary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3V21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 14L11 10L15 14L21 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs font-medium mt-1">Markets</span>
          </Link>
          
          <button onClick={() => setDrawerOpen(true)} className="flex flex-col items-center justify-center relative">
            <div className="w-10 h-10 rounded-full bg-accent-purple flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-xs font-medium mt-1 text-accent-purple">New</span>
          </button>
          
          <Link href="/portfolio" className="flex flex-col items-center justify-center text-text-tertiary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1 10H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs font-medium mt-1">Portfolio</span>
          </Link>
          
          <Link href="/profile" className="flex flex-col items-center justify-center text-text-tertiary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs font-medium mt-1">Profile</span>
          </Link>
        </div>
      </div>

      <QuickActionDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        actions={[
          { label: 'Create Market', onClick: () => console.log('create') },
          { label: 'Import News', onClick: () => console.log('import') },
          { label: 'Scan Headlines', onClick: () => console.log('scan') },
        ]}
      />
    </main>
  );
}
