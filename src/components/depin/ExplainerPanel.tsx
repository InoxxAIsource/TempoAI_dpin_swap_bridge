import { useState } from 'react';
import { ChevronDown, ChevronUp, Info, Zap, DollarSign, Globe2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const ExplainerPanel = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="p-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Info className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold">How DePIN Works on Tempo</h3>
              <p className="text-sm text-muted-foreground">
                {isExpanded ? 'Click to collapse' : 'Click to learn how you earn rewards'}
              </p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          )}
        </button>

        {isExpanded && (
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-blue-500" />
                </div>
                <h4 className="font-semibold">1. Devices Report Metrics</h4>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground ml-10">
                <li>• Energy produced (solar panels)</li>
                <li>• Temperature readings (sensors)</li>
                <li>• Uptime monitoring</li>
                <li>• Signed with device keys</li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-green-500" />
                </div>
                <h4 className="font-semibold">2. Earn Rewards</h4>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground ml-10">
                <li>• <strong>$0.05 per kWh</strong> produced</li>
                <li>• <strong>2x multiplier</strong> for verified devices</li>
                <li>• Rewards in USDC (testnet)</li>
                <li>• Daily automatic calculations</li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Globe2 className="w-4 h-4 text-purple-500" />
                </div>
                <h4 className="font-semibold">3. Bridge Cross-Chain</h4>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground ml-10">
                <li>• Use Wormhole to move rewards</li>
                <li>• Available on 7+ chains</li>
                <li>• Combine with DeFi yields</li>
                <li>• Low-cost transfers</li>
              </ul>
            </div>
          </div>
        )}

        {isExpanded && (
          <div className="mt-6 flex gap-3">
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <a href="/depin-docs" target="_blank">
                <ExternalLink className="w-4 h-4" />
                Read Full Guide
              </a>
            </Button>
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                Watch Tutorial Video
              </a>
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ExplainerPanel;
