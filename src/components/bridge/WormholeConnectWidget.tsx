import { useEffect, useState, useMemo } from 'react';
import WormholeConnect, { type config } from '@wormhole-foundation/wormhole-connect';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useWalletContext } from '@/contexts/WalletContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const WormholeConnectWidget = () => {
  const { theme } = useTheme();
  const { isAnyWalletConnected } = useWalletContext();
  const [widgetKey, setWidgetKey] = useState(0);

  // Force widget remount on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setWidgetKey(prev => prev + 1);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

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

  // Create a proper MUI theme
  const muiTheme = useMemo(() => createTheme({
    palette: {
      mode: theme === 'dark' ? 'dark' : 'light',
    },
  }), [theme]);

  // Memoize config to prevent unnecessary recreations
  const wormholeConfig: config.WormholeConnectConfig = useMemo(() => ({
    env: 'testnet',
    chains: ['Sepolia', 'Solana', 'ArbitrumSepolia', 'BaseSepolia', 'OptimismSepolia', 'PolygonSepolia'],
    rpcs: {
      Sepolia: 'https://rpc2.sepolia.org',
      Solana: 'https://api.devnet.solana.com',
      ArbitrumSepolia: 'https://sepolia-rollup.arbitrum.io/rpc',
      BaseSepolia: 'https://sepolia.base.org',
      OptimismSepolia: 'https://sepolia.optimism.io',
      PolygonSepolia: 'https://rpc-amoy.polygon.technology',
    },
  }), []);

  useEffect(() => {
    console.log('🌉 Wormhole Bridge Config Applied:', {
      env: 'testnet',
      chains: wormholeConfig.chains,
      timestamp: new Date().toISOString()
    });
  }, [wormholeConfig]);

  return (
    <ThemeProvider theme={muiTheme}>
      <div className="w-full">
        {!isAnyWalletConnected && (
          <div className="mb-4 p-4 border border-warning rounded-xl bg-warning/10">
            <p className="text-sm text-warning">
              Please connect your wallet to use the bridge
            </p>
          </div>
        )}
        <div className="mb-4 p-3 border border-blue-500/50 rounded-xl bg-blue-500/10">
          <p className="text-sm text-blue-400 font-medium">
            🧪 Testnet Mode: Sepolia • Solana Devnet • Arbitrum Sepolia • Base Sepolia
          </p>
        </div>
        <div className="border border-border rounded-2xl overflow-hidden bg-card">
          {widgetKey > 0 && (
            <WormholeConnect 
              key={`testnet-bridge-${widgetKey}`} 
              config={wormholeConfig}
            />
          )}
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
    </ThemeProvider>
  );
};

export default WormholeConnectWidget;
