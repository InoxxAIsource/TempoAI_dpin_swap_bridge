import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import WormholeConnect, { config, WormholeConnectTheme } from '@wormhole-foundation/wormhole-connect';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useWalletContext } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { TransactionSuccessModal } from '@/components/bridge/TransactionSuccessModal';
import { ExternalLink } from 'lucide-react';

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
  const [networkMode, setNetworkMode] = useState<'Testnet' | 'Mainnet'>('Testnet');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [txDetails, setTxDetails] = useState<{
    hash: string;
    fromChain: string;
    toChain: string;
    token: string;
    amount: number;
    network: 'Mainnet' | 'Testnet';
  } | null>(null);
  const { theme: appTheme } = useTheme();
  const { toast } = useToast();
  const { evmAddress, solanaAddress } = useWalletContext(); // Only for transaction tracking

  // Force remount on initial load
  useEffect(() => {
    const timer = setTimeout(() => setWidgetKey(1), 100);
    return () => clearTimeout(timer);
  }, []);

  // Listen for swap events
  useEffect(() => {
    const handleSwapEvent = async (event: any) => {
      if (event.detail?.type === 'transfer' && event.detail?.txHash) {
        const txData = event.detail;
        const walletAddress = (evmAddress || solanaAddress || '').toLowerCase();
        
        // Store transaction details for modal immediately
        const transactionDetails = {
          hash: txData.txHash,
          fromChain: txData.fromChain || 'Unknown',
          toChain: txData.toChain || 'Unknown',
          token: txData.fromToken || 'Unknown',
          amount: txData.amount || 0,
          network: networkMode,
        };
        
        setTxDetails(transactionDetails);
        setShowSuccessModal(true);
        
        // Generate WormholeScan URL
        const wormholeScanUrl = `https://wormholescan.io/#/tx/${txData.txHash}?network=${networkMode}`;
        
        try {
          // Save to database
          const { error } = await supabase.from('cross_chain_swaps').insert({
            wallet_address: walletAddress,
            from_chain: transactionDetails.fromChain,
            to_chain: transactionDetails.toChain,
            from_token: transactionDetails.token,
            to_token: txData.toToken || 'Unknown',
            from_amount: transactionDetails.amount,
            estimated_to_amount: txData.estimatedAmount || 0,
            route_used: txData.route || {},
            tx_hash: txData.txHash,
            status: 'pending',
            network: networkMode,
          });

          if (error) {
            console.error('Error saving swap to database:', error);
            toast({
              title: "⚠️ Swap Tracking Failed",
              description: (
                <div className="space-y-2">
                  <p>Swap initiated but couldn't save to history.</p>
                  <a 
                    href={wormholeScanUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Track on WormholeScan <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ) as any,
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error('Error handling swap event:', error);
        }
      }
    };

    window.addEventListener('wormhole-transfer', handleSwapEvent);
    return () => window.removeEventListener('wormhole-transfer', handleSwapEvent);
  }, [evmAddress, solanaAddress, toast, networkMode]);

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

  return (
    <ThemeProvider theme={muiTheme}>
      <style dangerouslySetInnerHTML={{ __html: portalStyleOverrides }} />
      
      {/* Transaction Success Modal */}
      <TransactionSuccessModal
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        transaction={txDetails}
      />
      
      <div className="space-y-4">
        {/* Network Mode Toggle */}
        <div className="mb-4 flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant={networkMode === 'Testnet' ? 'default' : 'outline'}
            onClick={() => setNetworkMode('Testnet')}
          >
            🧪 Testnet
          </Button>
          <Button
            size="sm"
            variant={networkMode === 'Mainnet' ? 'default' : 'outline'}
            onClick={() => setNetworkMode('Mainnet')}
          >
            🌐 Mainnet
          </Button>
        </div>

        {/* Wormhole Widget */}
        <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-lg">
          <WormholeConnect 
            key={`${networkMode.toLowerCase()}-swap-${widgetKey}`}
            config={wormholeConfig}
            theme={customWormholeTheme}
          />
        </div>

        {/* Footer */}
        <p className="text-xs text-center text-muted-foreground mt-4">
          Powered by{' '}
          <a
            href="https://wormhole.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Wormhole
          </a>
        </p>
      </div>
    </ThemeProvider>
  );
};
