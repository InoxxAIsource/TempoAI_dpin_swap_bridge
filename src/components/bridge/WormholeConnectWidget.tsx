import { useEffect, useRef } from 'react';
import WormholeConnect from '@wormhole-foundation/wormhole-connect';
import { useTheme } from '@/contexts/ThemeContext';
import { useWalletContext } from '@/contexts/WalletContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const WormholeConnectWidget = () => {
  const { theme } = useTheme();
  const { isAnyWalletConnected } = useWalletContext();
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Listen for Wormhole transaction events
    const handleWormholeEvent = async (event: any) => {
      if (event.detail?.type === 'transfer' && event.detail?.txHash) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            const txData = event.detail;
            await supabase.from('wormhole_transactions').insert({
              user_id: user.id,
              from_chain: txData.fromChain || 'Unknown',
              to_chain: txData.toChain || 'Unknown',
              from_token: txData.token || 'Unknown',
              to_token: txData.token || 'Unknown',
              amount: txData.amount || 0,
              tx_hash: txData.txHash,
              status: 'pending',
              wormhole_vaa: txData.vaa || null,
            });

            toast({
              title: "Transaction Submitted",
              description: "Your bridge transaction has been submitted and is being tracked.",
            });
          }
        } catch (error) {
          console.error('Error saving transaction:', error);
        }
      }
    };

    window.addEventListener('wormhole-transfer', handleWormholeEvent as EventListener);

    return () => {
      window.removeEventListener('wormhole-transfer', handleWormholeEvent as EventListener);
    };
  }, []);

  const wormholeConfig = {
    env: 'mainnet' as const,
    networks: ['ethereum', 'polygon', 'arbitrum', 'avalanche', 'solana', 'optimism', 'bsc', 'base'],
    tokens: ['ETH', 'WETH', 'USDC', 'USDT', 'WBTC', 'DAI'],
    mode: theme === 'dark' ? 'dark' : 'light',
    customTheme: {
      primary: 'hsl(var(--primary))',
      secondary: 'hsl(var(--secondary))',
      text: 'hsl(var(--foreground))',
      textSecondary: 'hsl(var(--muted-foreground))',
      error: 'hsl(var(--destructive))',
      success: 'hsl(var(--primary))',
      badge: 'hsl(var(--secondary))',
      font: 'inherit',
    },
  };

  return (
    <div ref={widgetRef} className="w-full">
      {!isAnyWalletConnected && (
        <div className="mb-4 p-4 border border-warning rounded-xl bg-warning/10">
          <p className="text-sm text-warning">
            Please connect your wallet to use the bridge
          </p>
        </div>
      )}
      <div className="border border-border rounded-2xl overflow-hidden bg-card">
        <WormholeConnect config={wormholeConfig} />
      </div>
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <span>Powered by</span>
        <a 
          href="https://wormhole.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          Wormhole
        </a>
      </div>
    </div>
  );
};

export default WormholeConnectWidget;
