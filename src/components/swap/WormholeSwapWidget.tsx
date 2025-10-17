import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import WormholeConnect, { config, WormholeConnectTheme } from '@wormhole-foundation/wormhole-connect';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useWalletContext } from '@/contexts/WalletContext';
import { useTokenBalances } from '@/hooks/useTokenBalances';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BalanceDisplay } from '@/components/bridge/BalanceDisplay';
import { QuickFillButtons } from '@/components/bridge/QuickFillButtons';
import { ConversionRate } from '@/components/bridge/ConversionRate';

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
  const [networkMode, setNetworkMode] = useState<'Testnet' | 'Mainnet'>('Testnet');
  const { theme: appTheme } = useTheme();
  const { toast } = useToast();
  const { evmAddress, solanaAddress } = useWalletContext();
  const { usdcBalance } = useTokenBalances(evmAddress || '', networkMode === 'Testnet' ? 11155111 : 1);
  const [selectedAmount, setSelectedAmount] = useState<string>('');

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

  // Portal Bridge CSS overrides
  const portalStyleOverrides = `
    .wormhole-connect-button-token {
      border-radius: 24px !important;
      padding: 8px 16px !important;
      background: hsl(var(--primary) / 0.1) !important;
      border: 1px solid hsl(var(--primary) / 0.3) !important;
      transition: all 0.2s ease;
    }
    .wormhole-connect-button-token:hover {
      background: hsl(var(--primary) / 0.2) !important;
      border-color: hsl(var(--primary) / 0.5) !important;
    }
    .wormhole-connect-input {
      font-size: 2rem !important;
      font-weight: 600 !important;
      background: transparent !important;
    }
    .wormhole-connect-label {
      font-size: 0.875rem !important;
      text-transform: uppercase !important;
      letter-spacing: 0.05em !important;
      font-weight: 500 !important;
    }
    .wormhole-connect-button-primary {
      background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent))) !important;
      border-radius: 16px !important;
      padding: 16px 24px !important;
      font-size: 1rem !important;
      font-weight: 600 !important;
      border: none !important;
      box-shadow: 0 4px 12px hsl(var(--primary) / 0.3) !important;
      transition: all 0.2s ease !important;
    }
    .wormhole-connect-button-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px hsl(var(--primary) / 0.4) !important;
    }
    @media (max-width: 768px) {
      .wormhole-connect-input { font-size: 1.5rem !important; }
      .wormhole-connect-button-primary { padding: 14px 20px !important; font-size: 0.9rem !important; }
    }
  `;

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

  // Custom Wormhole Connect Theme matching Portal Bridge
  const customWormholeTheme = useMemo((): WormholeConnectTheme => {
    const isDark = appTheme === 'dark';
    return {
      mode: isDark ? 'dark' : 'light',
      primary: '#9b87f5',
      secondary: '#1a1d2e',
      divider: '#2a2d3e',
      background: isDark ? '#0f0f1a' : '#ffffff',
      text: isDark ? '#ffffff' : '#000000',
      textSecondary: isDark ? '#a0a0b0' : '#666666',
      error: '#ef4444',
      success: '#10b981',
      warning: '#f59e0b',
      info: '#3b82f6',
      button: {
        primary: '#9b87f5',
        primaryText: '#000000',
        action: '#10b981',
        actionText: '#ffffff',
        disabled: '#3a3a4a',
        disabledText: '#6b6b7b',
        hover: '#8cd4c6',
      },
      font: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    } as any;
  }, [appTheme]);

  // Validate Alchemy API Key
  const isValidAlchemyKey = (key: string | undefined): boolean => {
    if (!key) return false;
    // Alchemy keys are 32 characters alphanumeric
    if (key.length !== 32) return false;
    // Check for placeholder values
    if (key.includes('your_alchemy') || key.includes('placeholder')) return false;
    return /^[a-zA-Z0-9_-]{32}$/.test(key);
  };

  // Wormhole Connect configuration for SWAPS
  const wormholeConfig: config.WormholeConnectConfig = useMemo(() => {
    const alchemyKey = import.meta.env.VITE_ALCHEMY_API_KEY;
    const useAlchemy = isValidAlchemyKey(alchemyKey);
    
    if (networkMode === 'Testnet') {
      const sepoliaRpc = useAlchemy
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
    }

    // Mainnet configuration with validated Alchemy or public fallbacks
    return {
      network: 'Mainnet',
      chains: ['Ethereum', 'Solana', 'Arbitrum', 'Base', 'Optimism', 'Polygon', 'Avalanche', 'Bsc'],
      tokens: ['ETH', 'WETH', 'USDC', 'USDT', 'WBTC', 'SOL'],
      rpcs: {
        Ethereum: useAlchemy ? `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}` : 'https://ethereum-rpc.publicnode.com',
        Solana: useAlchemy ? `https://solana-mainnet.g.alchemy.com/v2/${alchemyKey}` : 'https://api.mainnet-beta.solana.com',
        Arbitrum: useAlchemy ? `https://arb-mainnet.g.alchemy.com/v2/${alchemyKey}` : 'https://arbitrum.llamarpc.com',
        Base: useAlchemy ? `https://base-mainnet.g.alchemy.com/v2/${alchemyKey}` : 'https://base.llamarpc.com',
        Optimism: useAlchemy ? `https://opt-mainnet.g.alchemy.com/v2/${alchemyKey}` : 'https://optimism.llamarpc.com',
        Polygon: useAlchemy ? `https://polygon-mainnet.g.alchemy.com/v2/${alchemyKey}` : 'https://polygon.llamarpc.com',
        Avalanche: 'https://avalanche.public-rpc.com',
        Bsc: 'https://bsc.publicnode.com',
      },
      walletConnectProjectId: '7cb724bf60c8e3b1b67fdadd7bafcace',
    };
  }, [networkMode]);


  // Listen for RPC errors from the widget
  useEffect(() => {
    const handleRpcError = (event: any) => {
      console.error('Wormhole RPC error:', event.detail);
      setRpcError(event.detail?.message || 'RPC connection issue detected');
    };

    window.addEventListener('wormhole-rpc-error', handleRpcError);
    return () => window.removeEventListener('wormhole-rpc-error', handleRpcError);
  }, []);

  const isAnyWalletConnected = Boolean(evmAddress || solanaAddress);
  const alchemyKey = import.meta.env.VITE_ALCHEMY_API_KEY;
  const rpcProvider = isValidAlchemyKey(alchemyKey) ? 'Alchemy (Fast)' : 'Public RPCs';

  return (
    <ThemeProvider theme={muiTheme}>
      <style dangerouslySetInnerHTML={{ __html: portalStyleOverrides }} />
      <div className="space-y-4">
        {/* Network Mode Toggle */}
        <div className="flex flex-col gap-2 p-3 bg-muted/50 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium flex items-center gap-2">
              Network Mode
              <Badge variant="outline" className="text-xs">
                {rpcProvider}
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 p-1 bg-background rounded-lg">
            <Button
              variant={networkMode === 'Testnet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setNetworkMode('Testnet')}
              className="flex-1 text-xs"
            >
              🧪 Testnet
            </Button>
            <Button
              variant={networkMode === 'Mainnet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setNetworkMode('Mainnet')}
              className="flex-1 text-xs"
            >
              🌐 Mainnet
            </Button>
          </div>
        </div>

        {/* Show only actual RPC errors from the widget */}
        {rpcError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Connection Issue:</strong> {rpcError}
            </AlertDescription>
          </Alert>
        )}

        {/* Balance Display */}
        {isAnyWalletConnected && evmAddress && (
          <BalanceDisplay
            token="USDC"
            balance={usdcBalance}
            address={evmAddress}
          />
        )}

        {/* Quick Fill Buttons */}
        {isAnyWalletConnected && (
          <QuickFillButtons
            balance={usdcBalance}
            onAmountSelect={setSelectedAmount}
            disabled={!evmAddress}
          />
        )}

        {/* Wormhole Widget */}
        <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-lg">
          <WormholeConnect 
            key={`${networkMode.toLowerCase()}-swap-${widgetKey}`}
            config={wormholeConfig}
            theme={customWormholeTheme}
          />
        </div>

        {/* Conversion Rate */}
        {networkMode === 'Mainnet' && (
          <ConversionRate
            fromToken="USDC"
            toToken="USDC"
            rate="1.00"
            usdValue="1.00"
          />
        )}

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
    </ThemeProvider>
  );
};
