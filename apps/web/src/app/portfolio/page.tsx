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
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-background-tertiary sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-headline-medium font-bold">Portfolio</h1>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:bg-background-secondary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6">
        {/* Balance card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-3">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <span className="text-text-secondary text-sm">Total balance</span>
                  <AmountDisplay value={user.totalBalance} size="xl" />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6 mt-4 md:mt-0">
                  <div>
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
                  
                  <div>
                    <span className="text-text-secondary text-sm block">ROI</span>
                    <span className="text-accent-green font-medium text-lg">
                      +{(user.performance.returnPercentage * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 h-[200px] bg-background-card rounded-lg flex items-center justify-center border border-background-tertiary">
                {/* This would be a chart in a real app */}
                <div className="text-text-tertiary">Portfolio Performance Chart</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Bets */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-headline-medium font-bold">Active Bets</h2>
            <div className="text-text-secondary text-sm">{activeBets.length} active bets</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeBets.map((bet) => (
              <Link href={`/markets/${bet.id}`} key={bet.id}>
                <Card className="h-full hover:border-accent-primary/30 transition-colors">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-headline-small">{bet.market}</CardTitle>
                      <span className={`text-sm font-medium px-2 py-1 rounded-md ${
                        bet.betSide === 'Yes' ? 'bg-accent-primary/10 text-accent-primary' : 'bg-market-red/10 text-market-red'
                      }`}>
                        {bet.betSide}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <span className="text-text-tertiary text-sm block mb-1">Bet Amount</span>
                        <AmountDisplay value={bet.betAmount} size="sm" />
                      </div>
                      <div>
                        <span className="text-text-tertiary text-sm block mb-1">Potential Win</span>
                        <AmountDisplay value={bet.potentialWinnings} size="sm" trend="up" />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-text-tertiary text-sm mt-4 pt-4 border-t border-background-tertiary">
                      <div>Odds: {Math.round(bet.odds * 100)}%</div>
                      <div>Ends: {bet.deadline.toLocaleDateString()}</div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section>
          <h2 className="text-headline-medium font-bold mb-4">Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <span className="text-text-tertiary text-sm block mb-2">Active Positions</span>
                  <span className="text-display-small font-bold">{user.bets.active}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <span className="text-text-tertiary text-sm block mb-2">Won</span>
                  <span className="text-display-small font-bold text-accent-green">{user.bets.won}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <span className="text-text-tertiary text-sm block mb-2">Lost</span>
                  <span className="text-display-small font-bold text-market-red">{user.bets.lost}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-background-tertiary bg-background z-50">
        <div className="flex items-center justify-around h-16">
          <Link href="/" className="flex flex-col items-center justify-center text-text-tertiary">
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
          
          <div className="flex flex-col items-center justify-center relative">
            <button className="w-10 h-10 rounded-full bg-accent-primary flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="text-xs font-medium mt-1 text-accent-primary">New</span>
          </div>
          
          <Link href="/portfolio" className="flex flex-col items-center justify-center text-accent-primary">
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
    </main>
  );
}