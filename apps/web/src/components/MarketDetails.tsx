"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { AmountDisplay } from './ui/AmountDisplay';
import { OddsDisplay } from './ui/OddsDisplay';

interface MarketDetailsProps {
  market: {
    id: string;
    statement: string;
    description: string[];
    deadline: string;
    pools: {
      yes: number;
      no: number;
    };
    odds: {
      yes: number;
      no: number;
    };
    status: 'open' | 'closed' | 'resolved_yes' | 'resolved_no' | 'invalid';
  };
}

export function MarketDetails({ 
  market,
}: MarketDetailsProps) {
  const isOpen = market.status === 'open';
  const isResolved = market.status === 'resolved_yes' || market.status === 'resolved_no';

  // Client-side handlers (keeps interactivity inside a Client Component)
  const handlePlaceBet = (side: 'yes' | 'no') => {
    // TODO: replace with real client-side logic (open modal, call API, etc.)
    console.log(`Place ${side} bet`);
  };

  const handleClaim = () => {
    // TODO: replace with real client-side logic (call claim endpoint)
    console.log('Claim winnings');
  };
  
  return (
    <div className="space-y-8">
      {/* Market Header */}
      <div>
        <div className="flex flex-wrap items-center justify-between mb-4">
          <h1 className="text-headline-large font-bold mr-4">{market.statement}</h1>
          <span className={`text-sm font-medium px-3 py-1 rounded-md ${
            market.status === 'open' ? 'bg-accent-green/10 text-accent-green' :
            market.status === 'closed' ? 'bg-market-yellow/10 text-market-yellow' :
            market.status === 'invalid' ? 'bg-market-red/10 text-market-red' :
            'bg-accent-primary/10 text-accent-primary'
          }`}>
            {market.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        
        <div className="space-y-3 text-text-secondary text-body-medium mb-6">
          {market.description.map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-text-tertiary text-sm">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Ends: {new Date(market.deadline).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" fill="currentColor"/>
            </svg>
            <span>ID: <span className="font-mono">{market.id}</span></span>
          </div>
        </div>
      </div>
      
      {/* Pools Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-headline-small">Market Pools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Yes Pool */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-secondary font-medium">Yes</span>
                  <OddsDisplay value={market.odds.yes} variant="modern" size="sm" />
                </div>
                <div className="flex justify-between items-center">
                  <AmountDisplay value={market.pools.yes} size="md" />
                  <span className="text-text-secondary text-sm">Pool Size</span>
                </div>
                <div className="mt-3 h-2.5 w-full rounded-full overflow-hidden bg-background-secondary">
                  <div 
                    className="h-full bg-accent-primary" 
                    style={{ width: `${market.odds.yes * 100}%` }}
                  />
                </div>
              </div>
              
              {/* No Pool */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-secondary font-medium">No</span>
                  <OddsDisplay value={market.odds.no} variant="modern" size="sm" />
                </div>
                <div className="flex justify-between items-center">
                  <AmountDisplay value={market.pools.no} size="md" />
                  <span className="text-text-secondary text-sm">Pool Size</span>
                </div>
                <div className="mt-3 h-2.5 w-full rounded-full overflow-hidden bg-background-secondary">
                  <div 
                    className="h-full bg-market-red" 
                    style={{ width: `${market.odds.no * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Trading Card */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-headline-small">Trade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 bg-background-secondary/50 rounded-lg border border-background-tertiary">
                <div className="text-center mb-6">
                  <span className="text-text-secondary block mb-1">Fee</span>
                  <span className="text-display-small font-bold">1.5%</span>
                </div>
                
                {isOpen && (
                  <div className="space-y-4">
                    <Button 
                      variant="primary" 
                      fullWidth 
                      size="lg"
                      onClick={() => handlePlaceBet('yes')}
                      className="flex justify-between items-center px-6 bg-accent-green hover:bg-accent-green-dark"
                    >
                      <span>Yes</span>
                      <span>{Math.round(market.odds.yes * 100)}%</span>
                    </Button>
                    <Button 
                      variant="secondary" 
                      fullWidth 
                      size="lg"
                      onClick={() => handlePlaceBet('no')}
                      className="flex justify-between items-center px-6 bg-market-red/20 hover:bg-market-red/30 text-market-red"
                    >
                      <span>No</span>
                      <span>{Math.round(market.odds.no * 100)}%</span>
                    </Button>
                  </div>
                )}
                
                {isResolved && (
                  <Button 
                    variant="primary" 
                    fullWidth 
                    size="lg"
                    onClick={handleClaim}
                  >
                    Claim Winnings
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Market Activity - Placeholder for future enhancement */}
      <Card>
        <CardHeader>
          <CardTitle>Market Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-60 flex items-center justify-center text-text-tertiary">
            <p>Trade history will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}