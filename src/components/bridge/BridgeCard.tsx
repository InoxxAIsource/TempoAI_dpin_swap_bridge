import { ArrowDownUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import ChainBadge from '../ui/ChainBadge';
import { Button } from '../ui/button';

const BridgeCard = () => {
  const [fromChain, setFromChain] = useState('Ethereum');
  const [toChain, setToChain] = useState('Polygon');
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState('USDC');

  const handleSwapChains = () => {
    const temp = fromChain;
    setFromChain(toChain);
    setToChain(temp);
  };

  return (
    <div className="border border-border rounded-2xl p-8 bg-card max-w-2xl mx-auto">
      {/* FROM Section */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <label className="text-sm text-muted-foreground">From</label>
          <span className="text-sm text-muted-foreground">Balance: 1,000 {token}</span>
        </div>
        
        <div className="border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <ChainBadge chain={fromChain} />
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
          
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 text-3xl font-bold bg-transparent border-none outline-none"
            />
            <div className="flex items-center gap-2 px-4 py-2 border border-border rounded-full cursor-pointer hover:border-primary/50 transition-all duration-300">
              <span className="font-medium">{token}</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Swap Button */}
      <div className="flex justify-center -my-2 relative z-10">
        <button
          onClick={handleSwapChains}
          className="w-12 h-12 rounded-full bg-primary text-primary-foreground hover:scale-110 transition-all duration-300 flex items-center justify-center"
        >
          <ArrowDownUp className="w-5 h-5" />
        </button>
      </div>

      {/* TO Section */}
      <div className="space-y-4 mt-6 mb-8">
        <label className="text-sm text-muted-foreground">To</label>
        
        <div className="border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <ChainBadge chain={toChain} />
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
          
          <div className="text-3xl font-bold text-muted-foreground">
            {amount || '0.00'}
          </div>
        </div>
      </div>

      {/* Fee Breakdown */}
      <div className="space-y-3 mb-6 p-4 border border-border rounded-xl bg-muted/30">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-muted-foreground">Bridge Fee</span>
          </div>
          <span className="font-medium">0.1%</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-muted-foreground">Gas Fee</span>
          </div>
          <span className="font-medium">~$2.50</span>
        </div>
        <div className="flex items-center justify-between text-sm pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-muted-foreground">Estimated Time</span>
          </div>
          <span className="font-medium">~2 minutes</span>
        </div>
      </div>

      {/* Bridge Button */}
      <Button className="w-full rounded-full h-12 text-base font-medium" size="lg">
        Bridge Assets
      </Button>
    </div>
  );
};

export default BridgeCard;
