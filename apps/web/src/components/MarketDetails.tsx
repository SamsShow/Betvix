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
  onPlaceBet?: (side: 'yes' | 'no') => void;
  onClaim?: () => void;
}

export function MarketDetails({ 
  market,
  onPlaceBet,
  onClaim,
}: MarketDetailsProps) {
  const isOpen = market.status === 'open';
  const isResolved = market.status === 'resolved_yes' || market.status === 'resolved_no';
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-headline-large font-semibold mb-2">{market.statement}</h1>
        <div className="space-y-2 text-text-secondary">
          {market.description.map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
        <div className="mt-4 text-text-tertiary text-sm">
          Ends: {new Date(market.deadline).toLocaleDateString()}
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Current Pools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-text-secondary">Yes Pool</span>
                <OddsDisplay value={market.odds.yes} variant="outline" size="sm" />
              </div>
              <AmountDisplay value={market.pools.yes} size="md" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-text-secondary">No Pool</span>
                <OddsDisplay value={market.odds.no} variant="outline" size="sm" />
              </div>
              <AmountDisplay value={market.pools.no} size="md" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {isOpen && (
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="primary" 
            fullWidth 
            onClick={() => onPlaceBet?.('yes')}
          >
            Bet Yes
          </Button>
          <Button 
            variant="outline" 
            fullWidth 
            onClick={() => onPlaceBet?.('no')}
          >
            Bet No
          </Button>
        </div>
      )}
      
      {isResolved && (
        <Button 
          variant="primary" 
          fullWidth 
          onClick={onClaim}
        >
          Claim Winnings
        </Button>
      )}
      
      <Card variant="highlight">
        <CardHeader>
          <CardTitle>Market Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Status</span>
              <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                market.status === 'open' ? 'bg-accent-green/20 text-accent-green' :
                market.status === 'closed' ? 'bg-yellow-500/20 text-yellow-400' :
                market.status === 'invalid' ? 'bg-red-500/20 text-red-400' :
                'bg-accent-purple/20 text-accent-purple'
              }`}>
                {market.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">ID</span>
              <span className="text-text-primary font-mono text-sm">{market.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Fee</span>
              <span className="text-text-primary">1.5%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
