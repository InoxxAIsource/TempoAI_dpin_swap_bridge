import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useWalletContext } from '@/contexts/WalletContext';

interface ExecutionCardProps {
  type: 'cross_chain_yield' | 'cross_chain_swap' | 'bridge';
  protocol: string;
  token: string;
  chain: string;
  fromChain?: string;
  amount: number;
  estimatedGas: string;
  executionTime: string;
  apy?: number;
}

export function ExecutionCard({ 
  type, 
  protocol, 
  token, 
  chain, 
  fromChain, 
  amount, 
  estimatedGas, 
  executionTime, 
  apy 
}: ExecutionCardProps) {
  const [isExecuting, setIsExecuting] = useState(false);
  const { evmAddress, solanaAddress, isAnyWalletConnected } = useWalletContext();

  const getProtocolUrl = (protocol: string, chain: string, token: string): string => {
    const chainParam = chain.toLowerCase();
    
    const urls: Record<string, string> = {
      'Aave': `https://app.aave.com/?marketName=proto_${chainParam}_v3`,
      'Compound': 'https://app.compound.finance/',
      'Curve': `https://curve.fi/#/${chainParam}/pools`,
      'Lido': 'https://stake.lido.fi/',
      'Uniswap': 'https://app.uniswap.org/',
      'Yearn': `https://yearn.fi/vaults/${chainParam}`,
      'Convex': 'https://www.convexfinance.com/stake',
      'Balancer': `https://app.balancer.fi/#/${chainParam}/pool`,
      'Stargate': 'https://stargate.finance/pool',
    };
    
    // Match protocol name (case-insensitive, partial match)
    for (const [key, url] of Object.entries(urls)) {
      if (protocol.toLowerCase().includes(key.toLowerCase())) {
        return url;
      }
    }
    
    // Fallback to protocol search
    return `https://www.google.com/search?q=${encodeURIComponent(protocol + ' ' + chain + ' app')}`;
  };

  const handleExecute = async () => {
    if (!isAnyWalletConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to execute trades",
        variant: "destructive",
      });
      return;
    }

    // Redirect to widgets with pre-filled params instead of mock execution
    try {
      if (type === 'cross_chain_swap') {
        const params = new URLSearchParams({
          sourceChain: fromChain || chain,
          targetChain: chain,
          sourceToken: token,
          amount: amount.toString()
        });
        
        window.location.href = `/swap?${params.toString()}`;
        return;
      }
      
      if (type === 'bridge') {
        const params = new URLSearchParams({
          sourceChain: fromChain || chain,
          targetChain: chain,
          token: token,
          amount: amount.toString()
        });
        
        window.location.href = `/bridge?${params.toString()}`;
        return;
      }
      
      if (type === 'cross_chain_yield') {
        // Check if same-chain or cross-chain
        const needsBridging = fromChain && fromChain !== chain;
        
        if (!needsBridging) {
          // Same-chain yield: Open protocol app directly
          const protocolUrl = getProtocolUrl(protocol, chain, token);
          window.open(protocolUrl, '_blank');
          
          toast({
            title: "Opening Protocol",
            description: `Opening ${protocol} to deposit ${token} on ${chain}`,
          });
          return;
        }
        
        // Cross-chain yield: Bridge first, then deposit
        toast({
          title: "Multi-step execution",
          description: "Step 1: Bridge assets. Step 2: Deposit into protocol.",
        });
        
        const params = new URLSearchParams({
          sourceChain: fromChain || chain,
          targetChain: chain,
          token: token,
          amount: amount.toString(),
          nextAction: 'deposit',
          protocol: protocol,
          apy: apy?.toString() || ''
        });
        
        window.location.href = `/bridge?${params.toString()}`;
        return;
      }
    } catch (error) {
      console.error('Execution error:', error);
      toast({
        title: "Execution failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const getActionLabel = () => {
    if (type === 'cross_chain_yield') {
      const needsBridging = fromChain && fromChain !== chain;
      if (!needsBridging) {
        return (
          <>
            Open {protocol} App
            <ExternalLink className="w-4 h-4 ml-2" />
          </>
        );
      }
      return 'Execute Yield Strategy';
    }
    if (type === 'cross_chain_swap') return 'Execute Swap';
    return 'Execute Bridge';
  };

  return (
    <div className="border border-border rounded-xl p-4 bg-card my-3">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-card-foreground">{protocol} {token}</h4>
          <p className="text-sm text-muted-foreground">{chain}</p>
        </div>
        {apy && (
          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-sm rounded-md">
            {apy}% APY
          </span>
        )}
      </div>
      
      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Estimated Gas:</span>
          <span className="text-card-foreground">{estimatedGas}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Execution Time:</span>
          <span className="text-card-foreground">{executionTime}</span>
        </div>
        {fromChain && fromChain !== chain && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Bridge Route:</span>
            <span className="text-card-foreground">{fromChain} → {chain}</span>
          </div>
        )}
      </div>
      
      <Button 
        onClick={handleExecute} 
        disabled={isExecuting || !isAnyWalletConnected}
        className="w-full"
        variant={type === 'cross_chain_yield' && fromChain === chain ? 'outline' : 'default'}
      >
        {isExecuting ? (
          <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Executing...</>
        ) : (
          <div className="flex items-center justify-center">
            {getActionLabel()}
          </div>
        )}
      </Button>
    </div>
  );
}
