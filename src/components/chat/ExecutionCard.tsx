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

  const handleExecute = async () => {
    if (!isAnyWalletConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to execute trades",
        variant: "destructive",
      });
      return;
    }

    setIsExecuting(true);

    try {
      let result;
      const walletAddress = evmAddress || solanaAddress;

      if (type === 'cross_chain_swap') {
        const { data, error } = await supabase.functions.invoke('wormhole-execute-swap', {
          body: { 
            fromChain: fromChain || chain, 
            toChain: chain, 
            token, 
            amount,
            walletAddress 
          }
        });
        
        if (error) throw error;
        result = data;
      } else if (type === 'cross_chain_yield') {
        const { data, error } = await supabase.functions.invoke('wormhole-execute-yield', {
          body: { 
            protocol, 
            token, 
            chain, 
            fromChain: fromChain || chain, 
            amount,
            walletAddress 
          }
        });
        
        if (error) throw error;
        result = data;
      } else if (type === 'bridge') {
        const { data, error } = await supabase.functions.invoke('wormhole-execute-bridge', {
          body: { 
            token, 
            amount, 
            fromChain: fromChain || chain, 
            toChain: chain,
            senderAddress: walletAddress,
            recipientAddress: walletAddress
          }
        });
        
        if (error) throw error;
        result = data;
      }

      toast({
        title: "Execution started!",
        description: `Transaction submitted. Expected completion in ${executionTime}`,
      });

      console.log('Execution result:', result);
    } catch (error) {
      console.error('Execution error:', error);
      toast({
        title: "Execution failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const getActionLabel = () => {
    if (type === 'cross_chain_yield') return 'Execute Yield Strategy';
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
      >
        {isExecuting ? (
          <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Executing...</>
        ) : (
          <>{getActionLabel()}</>
        )}
      </Button>
    </div>
  );
}
