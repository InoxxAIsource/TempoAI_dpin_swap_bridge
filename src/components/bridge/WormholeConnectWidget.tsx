import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import WormholeConnect, { type config, WormholeConnectTheme } from '@wormhole-foundation/wormhole-connect';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useWalletContext } from '@/contexts/WalletContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AlertCircle, HelpCircle, ChevronDown, ExternalLink, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const WormholeConnectWidget = () => {
  const { theme } = useTheme();
  const { 
    isAnyWalletConnected, 
    evmAddress, 
    solanaAddress,
    evmBalance,
    wethBalance,
    usdcBalance 
  } = useWalletContext();
  const [searchParams] = useSearchParams();
  const [widgetKey, setWidgetKey] = useState(0);
  const [rpcError, setRpcError] = useState<string | null>(null);
  const [rpcHealthy, setRpcHealthy] = useState<boolean | null>(null);
  const [networkMode, setNetworkMode] = useState<'Testnet' | 'Mainnet'>('Testnet');
  const [bridgePhase, setBridgePhase] = useState<'idle' | 'approval' | 'transfer' | 'attestation' | 'complete'>('idle');
  
  // Read URL parameters for DePIN claim flow
  const defaultAmount = searchParams.get('amount');
  const defaultFromChain = searchParams.get('fromChain');
  const defaultToChain = searchParams.get('toChain');
  const defaultToken = searchParams.get('token');
  const claimId = searchParams.get('claimId');

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
          const walletAddress = (evmAddress || solanaAddress || '').toLowerCase();
          
          if (!walletAddress) {
            console.error('No wallet connected');
            return;
          }
          
          const { data: { user } } = await supabase.auth.getUser();
          const txData = event.detail;
          
          // CHECK: Is this a DePIN claim flow?
          if (claimId) {
            // UPDATE existing transaction instead of creating new one
            const { error: updateError } = await supabase
              .from('wormhole_transactions')
              .update({
                tx_hash: txData.txHash,
                status: 'pending' as any,
                wormhole_vaa: txData.vaa || null,
              })
              .eq('user_id', user?.id)
              .eq('source_type', 'depin_rewards')
              .is('tx_hash', null)
              .order('created_at', { ascending: false })
              .limit(1);
              
            if (updateError) throw updateError;
            
            toast({
              title: "🌱 DePIN Claim Transaction Submitted",
              description: "Your rewards are being bridged. Check Claims page to track progress.",
            });
          } else {
            // CREATE new transaction (existing behavior)
            await supabase.from('wormhole_transactions').insert({
              user_id: user?.id || null,
              from_chain: txData.fromChain || 'Unknown',
              to_chain: txData.toChain || 'Unknown',
              from_token: txData.token || 'Unknown',
              to_token: txData.token || 'Unknown',
              amount: txData.amount || 0,
              tx_hash: txData.txHash,
              status: 'pending',
              wormhole_vaa: txData.vaa || null,
              wallet_address: walletAddress,
            });

            toast({
              title: "Transaction Submitted",
              description: "Your bridge transaction is being tracked. Check the Claims page to monitor progress.",
            });
          }
          
          // Emit completion event for yield deposit flow
          window.dispatchEvent(new CustomEvent('wormhole-transfer-complete', {
            detail: { ...txData, claimId }
          }));
        } catch (error) {
          console.error('Error saving transaction:', error);
          toast({
            title: "Error",
            description: "Failed to save transaction. Please note your transaction hash.",
            variant: "destructive"
          });
        }
      }
    };

    window.addEventListener('wormhole-transfer', handleWormholeEvent as EventListener);

    return () => {
      window.removeEventListener('wormhole-transfer', handleWormholeEvent as EventListener);
    };
  }, [evmAddress, solanaAddress, claimId]);

  // Create a proper MUI theme
  const muiTheme = useMemo(() => createTheme({
    palette: {
      mode: theme === 'dark' ? 'dark' : 'light',
    },
  }), [theme]);

  // Custom Wormhole Connect Theme
  const customWormholeTheme = useMemo((): WormholeConnectTheme => {
    return {
      mode: theme === 'dark' ? 'dark' : 'light',
      primary: '#78c4b6',
      secondary: '#1a1d2e',
      divider: theme === 'dark' ? '#2a2d3e' : '#e5e7eb',
      background: theme === 'dark' ? '#0f0f1a' : '#ffffff',
      text: theme === 'dark' ? '#ffffff' : '#000000',
      textSecondary: theme === 'dark' ? '#a0a0b0' : '#666666',
      error: '#ef4444',
      success: '#10b981',
      warning: '#f59e0b',
      info: '#3b82f6',
      font: 'inherit',
    } as any;
  }, [theme]);

  // RPC Config Helper
  const getRPCConfig = (mode: 'Testnet' | 'Mainnet', alchemyKey: string) => {
    if (mode === 'Testnet') {
      return {
        Sepolia: alchemyKey ? `https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}` : 'https://ethereum-sepolia-rpc.publicnode.com',
        Solana: alchemyKey ? `https://solana-devnet.g.alchemy.com/v2/${alchemyKey}` : 'https://api.devnet.solana.com',
        ArbitrumSepolia: 'https://sepolia-rollup.arbitrum.io/rpc',
        BaseSepolia: 'https://sepolia.base.org',
        OptimismSepolia: 'https://sepolia.optimism.io',
        PolygonSepolia: 'https://rpc-amoy.polygon.technology',
      };
    }
    
    return {
      Ethereum: alchemyKey ? `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}` : 'https://ethereum-rpc.publicnode.com',
      Solana: alchemyKey ? `https://solana-mainnet.g.alchemy.com/v2/${alchemyKey}` : 'https://api.mainnet-beta.solana.com',
      Arbitrum: alchemyKey ? `https://arb-mainnet.g.alchemy.com/v2/${alchemyKey}` : 'https://arb1.arbitrum.io/rpc',
      Base: alchemyKey ? `https://base-mainnet.g.alchemy.com/v2/${alchemyKey}` : 'https://mainnet.base.org',
      Optimism: alchemyKey ? `https://opt-mainnet.g.alchemy.com/v2/${alchemyKey}` : 'https://mainnet.optimism.io',
      Polygon: alchemyKey ? `https://polygon-mainnet.g.alchemy.com/v2/${alchemyKey}` : 'https://polygon-rpc.com',
      Avalanche: 'https://api.avax.network/ext/bc/C/rpc',
      Bsc: 'https://bsc-dataseed1.binance.org',
    };
  };

  // Memoize config to prevent unnecessary recreations
  const wormholeConfig = useMemo(() => {
    const alchemyKey = import.meta.env.VITE_ALCHEMY_API_KEY;
    
    const testnetConfig = {
      network: 'Testnet',
      chains: ['Sepolia', 'Solana', 'ArbitrumSepolia', 'BaseSepolia', 'OptimismSepolia', 'PolygonSepolia'],
      tokens: ['USDC'],
    };
    
    const mainnetConfig = {
      network: 'Mainnet',
      chains: ['Ethereum', 'Solana', 'Arbitrum', 'Base', 'Optimism', 'Polygon', 'Avalanche', 'Bsc'],
      tokens: ['ETH', 'WETH', 'USDC', 'USDT', 'WBTC', 'SOL'],
      routes: ['cctpManual', 'cctpRelay', 'TokenBridge', 'NTT'] as any[],
    };
    
    const activeConfig = networkMode === 'Mainnet' ? mainnetConfig : testnetConfig;
    
    const baseConfig = {
      ...activeConfig,
      rpcs: getRPCConfig(networkMode, alchemyKey || ''),
      walletConnectProjectId: '7cb724bf60c8e3b1b67fdadd7bafcace',
      ui: {
        title: networkMode === 'Testnet' ? 'Tempo Bridge (Testnet)' : 'Tempo Bridge',
        showHamburgerMenu: true,
        defaultInputs: {
          fromChain: networkMode === 'Testnet' ? 'Sepolia' : 'Ethereum',
          toChain: 'Solana',
        },
      },
      menu: [
        {
          label: 'View on WormholeScan',
          href: `https://wormholescan.io/#/?network=${networkMode}`,
          target: '_blank',
          order: 1,
        },
        {
          label: 'Transaction History',
          href: '/claim',
          target: '_self',
          order: 2,
        },
        {
          label: 'DePIN Rewards',
          href: '/depin',
          target: '_self',
          order: 3,
        },
      ],
      transactionSettings: {
        Solana: {
          priorityFee: {
            percentile: 0.9,
            percentileMultiple: 1.2,
            min: 100_000,
            max: 5_000_000,
          },
        },
      },
    } as config.WormholeConnectConfig;
    
    // Add bridge defaults if URL params exist (DePIN claim flow)
    if (defaultAmount && defaultFromChain && defaultToChain) {
      console.log('🌉 Wormhole Bridge Defaults:', {
        fromChain: defaultFromChain,
        toChain: defaultToChain,
        token: defaultToken || 'USDC',
        amount: defaultAmount,
        claimId: claimId
      });
      
      return {
        ...baseConfig,
        bridgeDefaults: {
          fromChain: defaultFromChain,
          toChain: defaultToChain,
          token: defaultToken || 'USDC',
          amount: defaultAmount,
        }
      } as config.WormholeConnectConfig;
    }
    
    return baseConfig;
  }, [networkMode, defaultAmount, defaultFromChain, defaultToChain, defaultToken]);

  // RPC Health Check using Alchemy
  useEffect(() => {
    const testRPC = async () => {
      const alchemyKey = import.meta.env.VITE_ALCHEMY_API_KEY;
      
      if (!alchemyKey) {
        console.warn('⚠️ Alchemy API key not configured. Using fallback RPC.');
        setRpcHealthy(null);
        setRpcError('Alchemy API key not configured. Token balances may be slow to load.');
        return;
      }

      try {
        const response = await fetch(`https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_blockNumber',
            params: [],
            id: 1,
          }),
        });
        const data = await response.json();
        if (data.result) {
          console.log('✅ Alchemy Sepolia RPC: Block', parseInt(data.result, 16));
          setRpcHealthy(true);
          setRpcError(null);
        } else {
          console.error('❌ Alchemy RPC Failed: No result');
          setRpcHealthy(false);
          setRpcError('RPC connection issue. Trying alternative endpoints...');
        }
      } catch (error) {
        console.error('❌ Alchemy RPC Failed:', error);
        setRpcHealthy(false);
        setRpcError('RPC connection issue detected. Using fallback endpoints.');
      }
    };
    
    testRPC();
    
    console.log('🌉 Wormhole Bridge Config Applied:', {
      network: 'Testnet',
      chains: wormholeConfig.chains,
      tokens: wormholeConfig.tokens,
      rpc: import.meta.env.VITE_ALCHEMY_API_KEY ? 'Alchemy RPC' : 'Public RPC',
      timestamp: new Date().toISOString()
    });
  }, [wormholeConfig]);
  
  // Error handling for RPC issues
  useEffect(() => {
    const handleRpcError = (event: any) => {
      if (event.detail?.error?.includes('Failed to fetch')) {
        setRpcError('Connection issue detected. Trying alternative endpoints...');
        setTimeout(() => setRpcError(null), 5000);
      }
    };
    
    window.addEventListener('wormhole-rpc-error', handleRpcError);
    return () => window.removeEventListener('wormhole-rpc-error', handleRpcError);
  }, []);

  // Bridge status tracking
  useEffect(() => {
    const handleBridgeStatus = (event: any) => {
      const phase = event.detail?.phase || 'idle';
      setBridgePhase(phase);
      
      if (phase === 'complete') {
        toast({
          title: "✅ Bridge Complete",
          description: "Your tokens have arrived on the destination chain",
        });
        setBridgePhase('idle');
      }
    };
    
    window.addEventListener('wormhole-bridge-status', handleBridgeStatus);
    return () => window.removeEventListener('wormhole-bridge-status', handleBridgeStatus);
  }, []);

  const alchemyKey = import.meta.env.VITE_ALCHEMY_API_KEY;

  // Check if user needs to wrap/swap
  const hasNativeEth = parseFloat(evmBalance || '0') > 0;
  const hasWeth = parseFloat(wethBalance || '0') > 0;
  const hasUsdc = parseFloat(usdcBalance || '0') > 0;
  const needsTokenConversion = hasNativeEth && !hasWeth && !hasUsdc;

  return (
    <ThemeProvider theme={muiTheme}>
      <div className="w-full max-w-2xl mx-auto">
        {/* Network Mode Toggle */}
        <div className="mb-6 flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xl">
              {networkMode === 'Testnet' ? '🧪' : '🌐'}
            </div>
            <div>
              <div className="font-semibold text-sm">Network Mode</div>
              <div className="text-xs text-muted-foreground">
                {networkMode === 'Testnet' 
                  ? 'Testnet tokens (no real value)' 
                  : 'Mainnet (real assets)'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={networkMode === 'Testnet' ? 'default' : 'outline'}
              onClick={() => setNetworkMode('Testnet')}
              className="text-xs h-8"
            >
              Testnet
            </Button>
            <Button
              size="sm"
              variant={networkMode === 'Mainnet' ? 'default' : 'outline'}
              onClick={() => setNetworkMode('Mainnet')}
              className="text-xs h-8"
            >
              Mainnet
            </Button>
          </div>
        </div>

        {/* Mainnet Warning */}
        {networkMode === 'Mainnet' && (
          <Alert className="mb-4 border-amber-500/50 bg-amber-500/10">
            <AlertCircle className="h-4 w-4 text-amber-400" />
            <AlertDescription className="text-sm text-amber-400">
              <strong>⚠️ Mainnet Mode:</strong> You are using real assets. Double-check all transaction details before confirming.
            </AlertDescription>
          </Alert>
        )}

        {/* Bridge Status Banner */}
        {bridgePhase !== 'idle' && (
          <Alert className="mb-4 border-blue-500/50 bg-blue-500/10 animate-pulse">
            <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
            <AlertDescription className="text-sm text-blue-400">
              {bridgePhase === 'approval' && '🔓 Approving token spend...'}
              {bridgePhase === 'transfer' && '🌉 Initiating cross-chain transfer...'}
              {bridgePhase === 'attestation' && '⏳ Waiting for guardian signatures...'}
            </AlertDescription>
          </Alert>
        )}
        {/* Balance Status Alert (Testnet Only) */}
        {networkMode === 'Testnet' && isAnyWalletConnected && evmAddress && needsTokenConversion && (
          <Alert className="mb-4 border-amber-500/50 bg-amber-500/10">
            <AlertCircle className="h-4 w-4 text-amber-400" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="text-sm text-amber-400">
                  <strong>⚠️ USDC Required</strong>
                </div>
                <div className="text-xs text-amber-300/90">
                  You have <strong>{evmBalance} ETH</strong> but need <strong>USDC</strong> to bridge via CCTP.
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7"
                    onClick={() => window.open(`https://app.uniswap.org/swap?chain=sepolia&inputCurrency=ETH&outputCurrency=USDC`, '_blank')}
                  >
                    Swap ETH → USDC
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* USDC CCTP Recommendation (Testnet) */}
        {networkMode === 'Testnet' && (
          <Alert className="mb-4 border-blue-500/50 bg-blue-500/10">
            <AlertCircle className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-sm text-blue-400">
              <strong>💡 CCTP Bridge:</strong> This bridge uses Circle's CCTP protocol for native USDC transfers. 
              Fast, reliable, and automatic delivery to Solana. Bridge time: 2-5 minutes.
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-4 p-4 border border-blue-500/50 rounded-xl bg-blue-500/10">
          <p className="text-sm text-blue-400">
            💡 <strong>Note:</strong> The Advanced Bridge has its own wallet connection. Click "Connect Wallet" inside the widget below.
          </p>
        </div>
        
        {/* Warning if Alchemy API key is missing */}
        {!alchemyKey && (
          <div className="mb-4 p-3 border border-yellow-500/50 rounded-xl bg-yellow-500/10 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-yellow-400">
              ⚠️ Alchemy API key not configured. Token balances may load slowly. Configure in Settings → Secrets.
            </p>
          </div>
        )}
        
        {/* Display RPC status and errors */}
        {rpcHealthy === false && (
          <div className="mb-4 p-3 border border-yellow-500/50 rounded-xl bg-yellow-500/10 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-yellow-400">
              RPC connection issue. Using fallback endpoints for better reliability.
            </p>
          </div>
        )}
        
        {rpcError && rpcHealthy !== false && (
          <div className="mb-4 p-3 border border-yellow-500/50 rounded-xl bg-yellow-500/10 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-yellow-400">{rpcError}</p>
          </div>
        )}
        
        {/* Network Info Badge */}
        <div className="mb-4 p-3 border border-blue-500/50 rounded-xl bg-blue-500/10">
          <p className="text-sm text-blue-400 font-medium">
            {networkMode === 'Testnet' 
              ? '🧪 Testnet Mode: Sepolia • Solana Devnet • Arbitrum Sepolia • Base Sepolia • More'
              : '🌐 Mainnet Mode: Ethereum • Solana • Arbitrum • Base • Optimism • Polygon • More'}
          </p>
          <p className="text-xs text-blue-300/80 mt-1">
            {networkMode === 'Testnet' 
              ? 'Supported tokens: USDC (via CCTP)'
              : 'Supported tokens: ETH, WETH, USDC, USDT, WBTC, SOL'}
            {rpcHealthy && alchemyKey && ' • Alchemy RPC Connected ✓'}
          </p>
        </div>

        {/* Wormhole Widget */}
        <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-lg">
          {widgetKey > 0 && (
            <WormholeConnect 
              key={`${networkMode.toLowerCase()}-bridge-${widgetKey}`} 
              config={wormholeConfig}
              theme={customWormholeTheme}
            />
          )}
        </div>
        {/* Help & FAQ Section */}
        <Collapsible className="mt-4 border border-border rounded-xl p-4">
          <CollapsibleTrigger className="flex items-center justify-between w-full hover:text-foreground transition-colors">
            <div className="flex items-center gap-2 text-sm font-medium">
              <HelpCircle className="w-4 h-4" />
              Bridge Help & FAQ
            </div>
            <ChevronDown className="w-4 h-4" />
          </CollapsibleTrigger>
          
          <CollapsibleContent className="pt-4 space-y-3 text-xs text-muted-foreground">
            <div>
              <strong className="text-foreground">What is CCTP?</strong>
              <p>Circle's Cross-Chain Transfer Protocol - native USDC bridging (2-5 min)</p>
            </div>
            
            <div>
              <strong className="text-foreground">Bridge Fees?</strong>
              <p>Gas fees on source/destination chains + small protocol fee (~0.1%)</p>
            </div>
            
            <div>
              <strong className="text-foreground">Testnet vs Mainnet?</strong>
              <p>Testnet: Free tokens for testing • Mainnet: Real assets with real value</p>
            </div>
            
            <div>
              <strong className="text-foreground">Track Progress?</strong>
              <p>Visit the <a href="/claim" className="text-primary hover:underline">Claims page</a> to track all bridge transactions</p>
            </div>
            
            <a 
              href="https://wormhole.com/docs/products/connect" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-1 mt-2"
            >
              Full Documentation <ExternalLink className="w-3 h-3" />
            </a>
          </CollapsibleContent>
        </Collapsible>

        {/* Footer */}
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
