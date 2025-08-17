import React from 'react';
import Link from 'next/link';
import { CapsuleCard } from '@/components/ui/CapsuleCard';

export default function Home() {
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
    <main className="pb-20">
      {/* Header */}
      <header className="bg-background pt-12 pb-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-display-small font-semibold">BetCaps</h1>
          <div className="h-10 w-10 rounded-full bg-background-secondary flex items-center justify-center">
            <span>👤</span>
          </div>
        </div>
        <p className="text-text-secondary">Today's trending prediction markets</p>
      </header>

      {/* Categories */}
      <div className="px-4 pb-4 overflow-x-auto scrollbar-hide">
        <div className="flex space-x-2 w-max">
          <button className="bg-accent-purple text-white px-4 py-2 rounded-full text-sm font-medium">
            All
          </button>
          <button className="bg-background-secondary text-text-primary px-4 py-2 rounded-full text-sm font-medium">
            Crypto
          </button>
          <button className="bg-background-secondary text-text-primary px-4 py-2 rounded-full text-sm font-medium">
            Politics
          </button>
          <button className="bg-background-secondary text-text-primary px-4 py-2 rounded-full text-sm font-medium">
            Finance
          </button>
          <button className="bg-background-secondary text-text-primary px-4 py-2 rounded-full text-sm font-medium">
            Tech
          </button>
        </div>
      </div>

      {/* Market Capsules */}
      <div className="px-4 space-y-4">
        {sampleMarkets.map(market => (
          <Link key={market.id} href={`/markets/${market.id}`}>
            <CapsuleCard 
              title={market.title}
              lines={market.lines}
              deadline={market.deadline}
              odds={market.odds}
              status={market.status}
            />
          </Link>
        ))}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background-card rounded-t-2xl shadow-lg border-t border-background-tertiary z-50">
        <div className="flex items-center justify-around h-16 px-2">
          <Link href="/" className="flex flex-col items-center justify-center w-16 text-accent-purple">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs font-medium mt-1">Home</span>
          </Link>
          
          <Link href="/explore" className="flex flex-col items-center justify-center w-16 text-text-tertiary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs font-medium mt-1">Explore</span>
          </Link>
          
          <div className="w-16 flex flex-col items-center">
            <button className="w-12 h-12 rounded-full bg-accent-purple flex items-center justify-center -mt-5 shadow-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
          <Link href="/portfolio" className="flex flex-col items-center justify-center w-16 text-text-tertiary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1 10H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs font-medium mt-1">Portfolio</span>
          </Link>
          
          <Link href="/profile" className="flex flex-col items-center justify-center w-16 text-text-tertiary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs font-medium mt-1">Profile</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}
