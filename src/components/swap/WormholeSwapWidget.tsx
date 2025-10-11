import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import WormholeConnect, { config } from '@wormhole-foundation/wormhole-connect';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useWalletContext } from '@/contexts/WalletContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface WormholeSwapWidgetProps {
  defaultSourceChain?: string;
  defaultTargetChain?: string;
  defaultSourceToken?: string;
  defaultAmount?: string;
}

export const WormholeSwapWidget = ({ 
  defaultSourceChain,
  defaultTargetChain,
  defaultSourceToken,
  defaultAmount
}: WormholeSwapWidgetProps) => {
  const [widgetKey, setWidgetKey] = useState(0);
  const [rpcError, setRpcError] = useState<string | null>(null);
  const { theme: appTheme } = useTheme();
  const { toast } = useToast();
  const { evmAddress, solanaAddress } = useWalletContext();

  // Force remount on initial load
  useEffect(() => {
    const timer = setTimeout(() => setWidgetKey(1), 100);
    return () => clearTimeout(timer);
  }, []);

  // Listen for swap events
  useEffect(() => {
    const handleSwapEvent = async (event: any) => {
      console.log('Wormhole swap event:', event.detail);
      
      try {
        const walletAddress = (evmAddress || solanaAddress || '').toLowerCase();
        
        // Save to database
        const { error } = await supabase.from('cross_chain_swaps').insert({
          wallet_address: walletAddress,
          from_chain: event.detail?.fromChain || 'Unknown',
          to_chain: event.detail?.toChain || 'Unknown',
          from_token: event.detail?.fromToken || 'Unknown',
          to_token: event.detail?.toToken || 'Unknown',
          from_amount: event.detail?.amount || 0,
          estimated_to_amount: event.detail?.estimatedAmount || 0,
          route_used: event.detail?.route || {},
          tx_hash: event.detail?.txHash || null,
          status: 'pending',
          network: 'Testnet',
        });

        if (error) {
          console.error('Error saving swap to database:', error);
          toast({
            title: "Database Error",
            description: "Swap initiated but couldn't save to history",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Swap Initiated",
            description: `Swapping ${event.detail?.fromToken} to ${event.detail?.toToken}`,
          });
        }
      } catch (error) {
        console.error('Error handling swap event:', error);
      }
    };

    window.addEventListener('wormhole-transfer', handleSwapEvent);
    return () => window.removeEventListener('wormhole-transfer', handleSwapEvent);
  }, [evmAddress, solanaAddress, toast]);

  // Create MUI theme based on app theme
  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: appTheme === 'dark' ? 'dark' : 'light',
        },
      }),
    [appTheme]
  );

  // Wormhole Connect configuration for TESTNET SWAPS
  const wormholeConfig: config.WormholeConnectConfig = useMemo(() => {
    const alchemyKey = import.meta.env.VITE_ALCHEMY_API_KEY;
    const sepoliaRpc = alchemyKey
      ? `https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`
      : 'https://ethereum-sepolia-rpc.publicnode.com';

    return {
      network: 'Testnet',
      
      chains: ['Sepolia', 'Solana', 'ArbitrumSepolia', 'BaseSepolia', 'OptimismSepolia', 'PolygonSepolia'],
      
      tokens: ['ETH', 'WETH', 'USDC'],
      
      rpcs: {
        Sepolia: sepoliaRpc,
        Solana: 'https://api.devnet.solana.com',
        ArbitrumSepolia: 'https://sepolia-rollup.arbitrum.io/rpc',
        BaseSepolia: 'https://sepolia.base.org',
        OptimismSepolia: 'https://sepolia.optimism.io',
        PolygonSepolia: 'https://rpc-amoy.polygon.technology',
      },
      
      walletConnectProjectId: '7cb724bf60c8e3b1b67fdadd7bafcace',
    };
  }, []);


  // Listen for RPC errors from the widget
  useEffect(() => {
    const handleRpcError = (event: any) => {
      console.error('Wormhole RPC error:', event.detail);
      setRpcError(event.detail?.message || 'RPC connection issue detected');
    };

    window.addEventListener('wormhole-rpc-error', handleRpcError);
    return () => window.removeEventListener('wormhole-rpc-error', handleRpcError);
  }, []);

  return (
    <div className="space-y-4">
      {/* Show only actual RPC errors from the widget */}
      {rpcError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Connection Issue:</strong> {rpcError}
          </AlertDescription>
        </Alert>
      )}

      {/* Info Messages */}
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>
          <strong>Note:</strong> This widget enables cross-chain token swaps on testnet networks.
          Bridge and swap in a single transaction using Wormhole's advanced routing.
        </p>
        <p>
          <strong>Supported Chains:</strong> Sepolia, Solana Devnet, Arbitrum Sepolia, Base Sepolia, 
          Optimism Sepolia, Polygon Sepolia (Amoy)
        </p>
        <p>
          <strong>How it works:</strong> Select different tokens on source and destination chains. 
          Wormhole will automatically bridge and swap in one transaction.
        </p>
      </div>

      {/* Wormhole Widget */}
      <ThemeProvider theme={muiTheme}>
        <div key={widgetKey} className="wormhole-swap-widget">
          <WormholeConnect config={wormholeConfig} />
        </div>
      </ThemeProvider>

      {/* Footer */}
      <p className="text-xs text-center text-muted-foreground">
        Powered by{' '}
        <a
          href="https://wormhole.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Wormhole Connect
        </a>
      </p>
    </div>
  );
};
