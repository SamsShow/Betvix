import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { AmountDisplay } from '@/components/ui/AmountDisplay';

export default function Portfolio() {
  // Sample user data
  const user = {
    totalBalance: 35981.00,
    bets: {
      active: 5,
      won: 12,
      lost: 3,
    },
    performance: {
      totalReturn: 3245.75,
      returnPercentage: 0.089, // 8.9%
    },
  };
  
  // Sample active bets
  const activeBets = [
    {
      id: '1',
      market: 'Will BTC hit $100k in 2024?',
      betSide: 'Yes',
      betAmount: 500,
      potentialWinnings: 825.50,
      odds: 0.62,
      deadline: new Date('2024-12-31'),
    },
    {
      id: '2',
      market: 'Will Fed cut rates in June 2024?',
      betSide: 'Yes',
      betAmount: 1000,
      potentialWinnings: 1282.05,
      odds: 0.78,
      deadline: new Date('2024-06-15'),
    },
    {
      id: '3',
      market: 'Will SEC approve ETH ETF in 2024?',
      betSide: 'No',
      betAmount: 750,
      potentialWinnings: 1363.63,
      odds: 0.55,
      deadline: new Date('2024-09-30'),
    },
  ];

  return (
    <main className="pb-20">
      {/* Header */}
      <header className="bg-background/70 backdrop-blur-md pt-10 pb-4 px-4 sticky top-0 z-20">
        <h1 className="text-display-small font-semibold mb-6">Portfolio</h1>
        
        {/* Balance card */}
        <Card variant="glass" className="mb-6">
          <CardContent className="py-6">
            <div className="mb-1">
              <span className="text-text-secondary text-sm">Total balance</span>
            </div>
            <AmountDisplay value={user.totalBalance} size="xl" />
            
            <div className="mt-6 h-[100px] bg-background/30 rounded-lg flex items-center justify-center">
              {/* This would be a chart in a real app */}
              <div className="text-accent-purple text-opacity-50">Portfolio Chart</div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex-1">
                <span className="text-text-secondary text-sm block">Return</span>
                <div className="flex items-center">
                  <AmountDisplay 
                    value={user.performance.totalReturn} 
                    size="sm"
                    trend="up" 
                    showTrendIndicator
                  />
                </div>
              </div>
              
              <div className="flex-1 text-right">
                <span className="text-text-secondary text-sm block">ROI</span>
                <span className="text-accent-green font-medium text-lg">
                  +{(user.performance.returnPercentage * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </header>

      {/* Active Bets */}
      <section className="px-4 mb-8">
        <h2 className="text-headline-medium font-semibold mb-4">Active Bets</h2>
        <div className="space-y-4">
          {activeBets.map((bet) => (
            <Link href={`/markets/${bet.id}`} key={bet.id}>
              <Card>
                <CardContent className="py-4">
                  <h3 className="font-medium mb-2">{bet.market}</h3>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                      bet.betSide === 'Yes' ? 'bg-accent-purple/20 text-accent-purple' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {bet.betSide}
                    </span>
                    <span className="text-text-tertiary text-sm">
                      Ends: {bet.deadline.toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-text-tertiary text-sm block">Bet Amount</span>
                      <AmountDisplay value={bet.betAmount} size="sm" />
                    </div>
                    <div>
                      <span className="text-text-tertiary text-sm block">Potential Win</span>
                      <AmountDisplay value={bet.potentialWinnings} size="sm" trend="up" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="px-4">
        <h2 className="text-headline-medium font-semibold mb-4">Stats</h2>
        <Card>
          <CardContent className="py-4">
            <div className="grid grid-cols-3 divide-x divide-background-tertiary">
              <div className="text-center px-2">
                <span className="text-text-tertiary text-sm block mb-1">Active</span>
                <span className="text-headline-small font-semibold">{user.bets.active}</span>
              </div>
              <div className="text-center px-2">
                <span className="text-text-tertiary text-sm block mb-1">Won</span>
                <span className="text-headline-small font-semibold text-accent-green">{user.bets.won}</span>
              </div>
              <div className="text-center px-2">
                <span className="text-text-tertiary text-sm block mb-1">Lost</span>
                <span className="text-headline-small font-semibold text-red-500">{user.bets.lost}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Bottom Navigation (contained within mobile shell) */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-background-card rounded-t-2xl shadow-lg border-t border-background-tertiary z-50">
        <div className="flex items-center justify-around h-16 px-2">
          <Link href="/" className="flex flex-col items-center justify-center w-16 text-text-tertiary">
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
          
          <Link href="/portfolio" className="flex flex-col items-center justify-center w-16 text-accent-purple">
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
