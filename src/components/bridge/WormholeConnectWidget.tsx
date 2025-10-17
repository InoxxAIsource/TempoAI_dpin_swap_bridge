import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import WormholeConnect, { type config, WormholeConnectTheme } from '@wormhole-foundation/wormhole-connect';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useWalletContext } from '@/contexts/WalletContext';
import { useTokenBalances } from '@/hooks/useTokenBalances';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AlertCircle, HelpCircle, ChevronDown, ExternalLink, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { BalanceDisplay } from './BalanceDisplay';
import { QuickFillButtons } from './QuickFillButtons';
import { ConversionRate } from './ConversionRate';

const WormholeConnectWidget = () => {
  const { theme } = useTheme();
  const { 
    isAnyWalletConnected, 
    evmAddress, 
    solanaAddress,
    evmBalance,
    wethBalance,
    usdcBalance: walletUsdcBalance 
  } = useWalletContext();
  const [searchParams] = useSearchParams();
  const [widgetKey, setWidgetKey] = useState(0);
  const [rpcError, setRpcError] = useState<string | null>(null);
  const [rpcHealthy, setRpcHealthy] = useState<boolean | null>(null);
  const [networkMode, setNetworkMode] = useState<'Testnet' | 'Mainnet'>('Testnet');
  const [bridgePhase, setBridgePhase] = useState<'idle' | 'approval' | 'transfer' | 'attestation' | 'complete'>('idle');
  const [selectedAmount, setSelectedAmount] = useState<string>('');
  
  // Fetch token balances
  const { usdcBalance: fetchedUsdcBalance } = useTokenBalances(evmAddress || '', networkMode === 'Testnet' ? 11155111 : 1);
  const usdcBalance = fetchedUsdcBalance || walletUsdcBalance || '0.00';
  
  // Read URL parameters for DePIN claim flow
  const defaultAmount = searchParams.get('amount');
  const defaultFromChain = searchParams.get('fromChain');
  const defaultToChain = searchParams.get('toChain');
  const defaultToken = searchParams.get('token');
  const claimId = searchParams.get('claimId');

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
    .wormhole-connect-container {
      border-radius: 24px !important;
      overflow: hidden !important;
    }
    @media (max-width: 768px) {
      .wormhole-connect-input {
        font-size: 1.5rem !important;
      }
      .wormhole-connect-button-primary {
        padding: 14px 20px !important;
        font-size: 0.9rem !important;
      }
    }
  `;

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

  // Custom Wormhole Connect Theme matching Portal Bridge
  const customWormholeTheme = useMemo((): WormholeConnectTheme => {
    const isDark = theme === 'dark';
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
      network: networkMode,
      chains: wormholeConfig.chains,
      tokens: wormholeConfig.tokens,
      rpc: import.meta.env.VITE_ALCHEMY_API_KEY ? 'Alchemy RPC' : 'Public RPC',
      timestamp: new Date().toISOString()
    });
  }, [wormholeConfig, networkMode]);
  
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
      <style dangerouslySetInnerHTML={{ __html: portalStyleOverrides }} />
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

        {/* Balance Display */}
        {isAnyWalletConnected && evmAddress && (
          <BalanceDisplay
            token="USDC"
            balance={usdcBalance}
            address={evmAddress}
            className="mb-3"
          />
        )}

        {/* Quick Fill Buttons */}
        {isAnyWalletConnected && evmAddress && (
          <div className="mb-3">
            <QuickFillButtons
              balance={usdcBalance}
              onAmountSelect={setSelectedAmount}
              disabled={!evmAddress}
            />
          </div>
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
        
        {/* Missing Alchemy Key Warning */}
        {!alchemyKey && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Alchemy API key not configured. Balances may load slowly using public RPC endpoints.
            </AlertDescription>
          </Alert>
        )}

        {/* RPC Health Status */}
        {rpcError && (
          <Alert className="mb-4" variant={rpcHealthy === false ? 'destructive' : 'default'}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {rpcError}
            </AlertDescription>
          </Alert>
        )}

        {/* Wormhole Connect Widget with Portal styling */}
        <div className="mb-4 border border-border rounded-2xl overflow-hidden bg-card shadow-lg">
          <WormholeConnect 
            key={`${networkMode.toLowerCase()}-bridge-${widgetKey}`} 
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

        {/* Bridge Help & FAQ */}
        <Collapsible className="mt-4 border border-border rounded-xl p-4 bg-card/50">
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              <span className="font-semibold">Bridge Help & FAQ</span>
            </div>
            <ChevronDown className="w-4 h-4 transition-transform duration-200" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-1">What is CCTP?</h4>
              <p className="text-muted-foreground">
                Circle's Cross-Chain Transfer Protocol (CCTP) enables native USDC transfers between blockchains. 
                Unlike wrapped tokens, CCTP burns USDC on the source chain and mints native USDC on the destination.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Fees & Time</h4>
              <p className="text-muted-foreground">
                Testnet: Free (except gas). Mainnet: ~$0.10-$2 depending on congestion. 
                Transfer time: 2-15 minutes. Automatic delivery (no manual redemption).
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Testnet vs Mainnet</h4>
              <p className="text-muted-foreground">
                Testnet uses fake tokens for testing. Mainnet uses real assets with real value. 
                Always verify transaction details before confirming on Mainnet.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Track Your Transfer</h4>
              <p className="text-muted-foreground">
                Visit the <a href="/claim" className="text-primary hover:underline">Claims page</a> to monitor 
                your bridge transactions. You can also view on{' '}
                <a 
                  href={`https://wormholescan.io/#/?network=${networkMode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  WormholeScan <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Powered By Footer */}
        <div className="mt-4 text-center text-xs text-muted-foreground">
          Powered by{' '}
          <a 
            href="https://wormhole.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Wormhole
          </a>
          {' '}& Circle CCTP
        </div>
      </div>
    </ThemeProvider>
  );
};

export default WormholeConnectWidget;
