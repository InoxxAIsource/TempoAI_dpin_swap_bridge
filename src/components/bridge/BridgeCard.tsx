import { ArrowDownUp, Wallet } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ChainSelector from './ChainSelector';
import TokenSelector from './TokenSelector';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useWalletContext } from '@/contexts/WalletContext';
import { toast } from 'sonner';

const BridgeCard = () => {
  const { evmAddress, evmBalance, solanaAddress, solanaBalance, isAnyWalletConnected } = useWalletContext();
  const [searchParams] = useSearchParams();
  const [fromChain, setFromChain] = useState('Ethereum');
  const [toChain, setToChain] = useState('Polygon');
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState('USDC');
  const [realBalance, setRealBalance] = useState<string>('0.00');
  
  // Read URL parameters for DePIN claim flow
  const urlAmount = searchParams.get('amount');
  const urlFromChain = searchParams.get('fromChain');
  const urlToChain = searchParams.get('toChain');
  const urlToken = searchParams.get('token');
  const urlClaimId = searchParams.get('claimId');

  // Pre-fill form with URL parameters for DePIN claim flow
  useEffect(() => {
    if (urlAmount) setAmount(urlAmount);
    if (urlFromChain) setFromChain(urlFromChain);
    if (urlToChain) setToChain(urlToChain);
    if (urlToken) setToken(urlToken);
  }, [urlAmount, urlFromChain, urlToChain, urlToken]);

  // Update real balance based on selected chain
  useEffect(() => {
    if (fromChain === 'Solana' && solanaBalance) {
      setRealBalance(solanaBalance);
    } else if (evmBalance) {
      setRealBalance(evmBalance);
    } else {
      setRealBalance('0.00');
    }
  }, [fromChain, evmBalance, solanaBalance]);

  const handleSwapChains = () => {
    const temp = fromChain;
    setFromChain(toChain);
    setToChain(temp);
  };

  // FIX 3: Switch to Advanced Bridge for testnet support
  const handleBridge = () => {
    if (!isAnyWalletConnected) {
      toast.error('Please connect your wallet first');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (parseFloat(amount) > parseFloat(realBalance)) {
      toast.error('Insufficient balance');
      return;
    }
    
    toast.info('Switching to Advanced Bridge', {
      description: 'The Advanced Bridge supports Sepolia and all testnet chains with lower fees.',
    });
    
    // Emit custom event to switch to advanced bridge tab
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('switch-to-advanced-bridge'));
    }, 800);
  };

  return (
    <div className="border border-border rounded-2xl p-6 md:p-8 bg-card max-w-2xl mx-auto overflow-hidden">
      {/* DePIN Claim Flow Indicator */}
      {urlClaimId && (
        <div className="mb-4 p-3 border border-green-500/50 rounded-xl bg-green-500/10">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/50">
              🌱 DePIN Rewards Claim
            </Badge>
            <span className="text-sm text-green-400">
              {urlAmount} {urlToken} from {urlFromChain} to {urlToChain}
            </span>
          </div>
        </div>
      )}
      
      {/* FROM Section */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="text-sm text-muted-foreground">From</label>
          <div className="flex items-center gap-2">
            {isAnyWalletConnected ? (
              <span className="text-sm text-muted-foreground">
                Balance: <span className="font-medium text-foreground">{realBalance}</span> {fromChain === 'Solana' ? 'SOL' : 'ETH'}
              </span>
            ) : (
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Wallet className="w-3 h-3" />
                Connect wallet
              </span>
            )}
          </div>
        </div>
        
        <div className="border border-border rounded-xl p-4 space-y-4">
          <ChainSelector 
            selectedChain={fromChain} 
            onSelectChain={setFromChain}
            excludeChain={toChain}
          />
          
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 text-3xl font-bold bg-transparent border-none outline-none min-w-0 w-full"
              style={{ appearance: 'textfield' }}
            />
            <TokenSelector 
              selectedToken={token} 
              onSelectToken={setToken}
            />
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
        
        <div className="border border-border rounded-xl p-4 space-y-4">
          <ChainSelector 
            selectedChain={toChain} 
            onSelectChain={setToChain}
            excludeChain={fromChain}
          />
          
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
      <Button 
        className="w-full rounded-full h-12 text-base font-medium" 
        size="lg"
        onClick={handleBridge}
        disabled={!isAnyWalletConnected || !amount || parseFloat(amount) <= 0}
      >
        {isAnyWalletConnected ? 'Bridge Assets' : 'Connect Wallet to Bridge'}
      </Button>
      
      {isAnyWalletConnected && (
        <div className="mt-4 p-3 rounded-xl bg-muted/30 border border-border">
          <p className="text-xs text-muted-foreground text-center">
            Connected: {fromChain === 'Solana' ? solanaAddress?.slice(0, 4) + '...' + solanaAddress?.slice(-4) : evmAddress?.slice(0, 6) + '...' + evmAddress?.slice(-4)}
          </p>
        </div>
      )}
    </div>
  );
};

export default BridgeCard;
