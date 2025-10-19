import { useEffect, useState, useMemo, memo } from 'react';
import { useSearchParams } from 'react-router-dom';
import WormholeConnect, { type config, WormholeConnectTheme } from '@wormhole-foundation/wormhole-connect';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useWalletContext } from '@/contexts/WalletContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { HelpCircle, ChevronDown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useCoinGeckoProxy } from '@/hooks/useCoinGeckoProxy';
import { TransactionSuccessModal } from './TransactionSuccessModal';

// Import Helius API key from environment (securely stored via Lovable Cloud)
const HELIUS_API_KEY = import.meta.env.VITE_HELIUS_API_KEY || '';

const WormholeConnectWidget = () => {
  const { theme } = useTheme();
  const { evmAddress, solanaAddress } = useWalletContext(); // Only for transaction tracking
  const [searchParams] = useSearchParams();
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
  const [capturedEvents, setCapturedEvents] = useState<any[]>([]);
  const [debugMode, setDebugMode] = useState(false);
  
  // 🎣 Install CoinGecko proxy to bypass CORS
  useCoinGeckoProxy();
  
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

  // Log network mode changes and force widget remount
  useEffect(() => {
    setWidgetKey(prev => prev + 1);
  }, [networkMode]);

  // Check localStorage for pending transactions on mount
  useEffect(() => {
    const checkPendingTransactions = async () => {
      const pending = JSON.parse(localStorage.getItem('pending_wormhole_txs') || '[]');
      
      if (pending.length > 0) {
        toast({
          title: "📋 Pending Transactions Found",
          description: `${pending.length} transaction(s) detected. Check Claims page for status.`,
        });
        
        // Clear after showing notification
        localStorage.removeItem('pending_wormhole_txs');
      }
    };
    
    checkPendingTransactions();
  }, []);


  useEffect(() => {
    // Listen for ALL possible Wormhole transaction events
    const handleWormholeEvent = async (event: any) => {
      console.log('🔔 Wormhole event received:', event.type);
      console.log('🔍 Full event data:', JSON.stringify(event.detail, null, 2));
      
      // Filter out approval events - these are NOT bridge transfers
      if (event.type?.includes('Approval') || event.type?.includes('approval')) {
        console.log('✅ Approval event detected (NOT A TRANSFER) - ignoring');
        return;
      }
      
      // Store event for debug panel
      if (debugMode) {
        setCapturedEvents(prev => [...prev, {
          type: event.type,
          detail: event.detail,
          timestamp: new Date().toISOString()
        }]);
      }
      
      // Try multiple extraction strategies
      const txData = event.detail;
      let txHash = 
        txData?.txHash || 
        txData?.tx_hash || 
        txData?.hash || 
        txData?.transactionHash ||
        txData?.sendTx ||
        txData?.transaction?.hash ||
        txData?.sourceTransaction ||
        txData?.txData?.sendTx ||
        txData?.redeem?.sendTx;
      
      if (!txHash) {
        console.log('ℹ️ No transaction hash found in event');
        return;
      }
      
      console.log('✅ Processing transaction:', txHash);
      
      const walletAddress = (evmAddress || solanaAddress || '').toLowerCase();
      
      const transactionDetails = {
        hash: txHash,
        fromChain: txData.fromChain || txData.sourceChain || 'Unknown',
        toChain: txData.toChain || txData.targetChain || txData.destinationChain || 'Unknown',
        token: txData.token || txData.asset || 'Unknown',
        amount: txData.amount || 0,
        network: networkMode,
      };
      
      console.log('📊 Transaction details:', transactionDetails);
      console.log('💰 Amount captured:', transactionDetails.amount, 'Type:', typeof transactionDetails.amount);
      
      setTxDetails(transactionDetails);
      setShowSuccessModal(true);
      
      const wormholeScanUrl = `https://wormholescan.io/#/tx/${txHash}?network=${networkMode}`;
      
      try {
        if (!walletAddress) {
          console.error('No wallet connected');
          toast({
            title: "⚠️ Transaction Sent",
            description: (
              <div className="space-y-2">
                <p>Transaction submitted but wallet not detected.</p>
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
          });
          return;
        }
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (claimId) {
          const { error: updateError } = await supabase
            .from('wormhole_transactions')
            .update({
              tx_hash: txHash,
              status: 'pending' as any,
              wormhole_vaa: txData.vaa || null,
            })
            .eq('user_id', user?.id)
            .eq('source_type', 'depin_rewards')
            .is('tx_hash', null)
            .order('created_at', { ascending: false })
            .limit(1);
            
          if (updateError) throw updateError;
        } else {
          // Insert new transaction - use blockchain verification for accuracy
          try {
            // Import verification utility
            const { verifyWormholeTransaction } = await import('@/utils/etherscanVerification');
            const { validateTransactionData } = await import('@/utils/transactionValidator');
            
            console.log('🔍 Verifying transaction on blockchain...');
            const verification = await verifyWormholeTransaction(txHash, networkMode as any);
            
            if (!verification.isValid || !verification.isWormholeTransfer) {
              toast({
                title: "⚠️ Invalid Transaction",
                description: "This doesn't appear to be a valid Wormhole transfer.",
                variant: "destructive"
              });
              return;
            }
            
            const amount = verification.amount ? Number(verification.amount) : 0;
            const token = verification.token || transactionDetails.token;
            
            console.log('💾 Verified amount:', amount, 'Token:', token);
            
            const insertData = {
              user_id: user?.id || null,
              from_chain: transactionDetails.fromChain,
              to_chain: transactionDetails.toChain,
              from_token: token,
              to_token: token,
              amount: amount,
              tx_hash: txHash,
              status: 'pending' as any,
              wormhole_vaa: txData.vaa || null,
              wallet_address: walletAddress,
            };
            
            // Validate before insert
            const validation = validateTransactionData(insertData);
            if (!validation.isValid) {
              console.error('❌ Validation failed:', validation.errors);
              toast({
                title: "⚠️ Transaction Validation Failed",
                description: validation.errors.join(', '),
                variant: "destructive"
              });
              return;
            }

            console.log('💾 Saving verified transaction to database:', insertData);

            const { error: insertError } = await supabase
              .from('wormhole_transactions')
              .insert(insertData);

            if (insertError) {
              console.error('❌ Failed to save transaction to database:', insertError);
              toast({
                variant: "destructive",
                title: "⚠️ Transaction Save Failed",
                description: "Transaction detected but failed to save. You can manually import it on the Claim page.",
              });
              throw new Error(insertError.message);
            }
            
            console.log('✅ Transaction saved successfully with verified data');
          } catch (err) {
            console.error('❌ Error saving transaction:', err);
            toast({
              variant: "destructive",
              title: "⚠️ Error Saving Transaction",
              description: err instanceof Error ? err.message : 'Unknown error occurred',
            });
          }
        }
        
        window.dispatchEvent(new CustomEvent('wormhole-transfer-complete', {
          detail: { ...txData, claimId }
        }));
      } catch (error) {
        const pending = JSON.parse(localStorage.getItem('pending_wormhole_txs') || '[]');
        pending.push({
          hash: txHash,
          network: networkMode,
          timestamp: Date.now(),
          walletAddress: walletAddress || 'unknown'
        });
        localStorage.setItem('pending_wormhole_txs', JSON.stringify(pending));
        
        toast({
          title: "⚠️ Transaction Tracking Failed",
          description: (
            <div className="space-y-2">
              <p>Transaction sent but couldn't save to history.</p>
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
          variant: "destructive"
        });
      }
    };

    // Listen to MULTIPLE event types for better compatibility
    const events = [
      'wormhole-transfer',
      'wormhole-transfer-complete', 
      'wormhole-transfer-success',
      'wormhole-transaction',
      'transaction-success'
    ];

    events.forEach(eventName => {
      window.addEventListener(eventName, handleWormholeEvent as EventListener);
    });

    return () => {
      events.forEach(eventName => {
        window.removeEventListener(eventName, handleWormholeEvent as EventListener);
      });
    };
  }, [evmAddress, solanaAddress, claimId, networkMode]);

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

  // Validate Alchemy API Key
  const isValidAlchemyKey = (key: string | undefined): boolean => {
    if (!key) return false;
    // Alchemy keys are 32 characters alphanumeric
    if (key.length !== 32) return false;
    // Check for placeholder values
    if (key.includes('your_alchemy') || key.includes('placeholder')) return false;
    return /^[a-zA-Z0-9_-]{32}$/.test(key);
  };

  // RPC Config Helper with validation
  const getRPCConfig = (mode: 'Testnet' | 'Mainnet', alchemyKey: string) => {
    const useAlchemy = isValidAlchemyKey(alchemyKey);
    
    if (mode === 'Testnet') {
      return {
        Sepolia: useAlchemy ? `https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}` : 'https://ethereum-sepolia-rpc.publicnode.com',
        Solana: useAlchemy ? `https://solana-devnet.g.alchemy.com/v2/${alchemyKey}` : 'https://api.devnet.solana.com',
        ArbitrumSepolia: 'https://sepolia-rollup.arbitrum.io/rpc',
        BaseSepolia: 'https://sepolia.base.org',
        OptimismSepolia: 'https://sepolia.optimism.io',
        PolygonSepolia: 'https://rpc-amoy.polygon.technology',
      };
    }
    
    // Mainnet - Use Helius for Solana (recommended by Wormhole for reliable mainnet access)
    return {
      Ethereum: useAlchemy ? `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}` : 'https://ethereum-rpc.publicnode.com',
      Solana: HELIUS_API_KEY 
        ? `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}` 
        : (useAlchemy ? `https://solana-mainnet.g.alchemy.com/v2/${alchemyKey}` : 'https://solana-rpc.publicnode.com'),
      Arbitrum: useAlchemy ? `https://arb-mainnet.g.alchemy.com/v2/${alchemyKey}` : 'https://arbitrum.llamarpc.com',
      Base: useAlchemy ? `https://base-mainnet.g.alchemy.com/v2/${alchemyKey}` : 'https://base.llamarpc.com',
      Optimism: useAlchemy ? `https://opt-mainnet.g.alchemy.com/v2/${alchemyKey}` : 'https://optimism.llamarpc.com',
      Polygon: useAlchemy ? `https://polygon-mainnet.g.alchemy.com/v2/${alchemyKey}` : 'https://polygon.llamarpc.com',
      Avalanche: 'https://avalanche.public-rpc.com',
      Bsc: 'https://bsc.publicnode.com',
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
          fromToken: 'USDC',
          toToken: 'USDC',
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
  }, [networkMode, defaultAmount, defaultFromChain, defaultToChain, defaultToken, claimId]);

  return (
    <ThemeProvider theme={muiTheme}>
      <style dangerouslySetInnerHTML={{ __html: portalStyleOverrides }} />
      
      {/* Transaction Success Modal */}
      <TransactionSuccessModal
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        transaction={txDetails}
      />
      
      <div className="w-full max-w-2xl mx-auto">
        {/* Debug Mode Toggle */}
        <div className="mb-4 flex justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setDebugMode(!debugMode)}
          >
            {debugMode ? '🐛 Debug ON' : '🐛 Debug OFF'}
          </Button>
        </div>
        
        {/* Network Mode Toggle */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-center gap-2">
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
          
          {/* Helius Status Indicator */}
          {HELIUS_API_KEY && networkMode === 'Mainnet' && (
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Helius RPC Active • Premium Solana Performance</span>
            </div>
          )}
        </div>

        {/* Wormhole Connect Widget */}
        <div className="mb-4 border border-border rounded-2xl overflow-hidden bg-card shadow-lg">
          <WormholeConnect 
            key={`${networkMode.toLowerCase()}-bridge-${widgetKey}`}
            config={wormholeConfig}
            theme={customWormholeTheme}
          />
        </div>

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
              <h4 className="font-semibold mb-1">Why don't I see USD prices?</h4>
              <p className="text-muted-foreground">
                Token prices may not display due to browser security restrictions (CORS). 
                This is normal and <strong>does NOT affect your ability to bridge</strong>. The transfer will 
                work correctly regardless of whether prices are shown.
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

        {/* Debug Panel - Always visible when debug mode is ON */}
        {debugMode && (
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
                🐛 Debug Panel
              </h3>
              <div className="text-xs space-x-2">
                <span className="text-yellow-700 dark:text-yellow-300">
                  Events: {capturedEvents.length}
                </span>
                <span className="text-yellow-700 dark:text-yellow-300">
                  • Network: {networkMode}
                </span>
              </div>
            </div>
            
            {capturedEvents.length === 0 ? (
              <div className="text-xs text-yellow-800 dark:text-yellow-200 bg-yellow-100 dark:bg-yellow-900/40 p-3 rounded">
                <p className="font-medium mb-1">⏳ Waiting for events...</p>
                <p>No Wormhole events captured yet. Events will appear here when transactions are initiated.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {capturedEvents.map((evt, idx) => (
                  <details key={idx} className="text-xs bg-white dark:bg-gray-800 p-2 rounded border border-yellow-300 dark:border-yellow-700">
                    <summary className="cursor-pointer font-mono font-medium">
                      {evt.type} - {new Date(evt.timestamp).toLocaleTimeString()}
                    </summary>
                    <pre className="mt-2 overflow-x-auto text-[10px] bg-gray-50 dark:bg-gray-900 p-2 rounded">
                      {JSON.stringify(evt.detail, null, 2)}
                    </pre>
                  </details>
                ))}
              </div>
            )}
            
            <div className="mt-3 pt-3 border-t border-yellow-300 dark:border-yellow-700">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                <strong>Debug Info:</strong> Wallet={evmAddress ? 'Connected' : 'Disconnected'} • 
                Listening to: wormhole-transfer, wormhole-transfer-complete, wormhole-transaction
              </p>
            </div>
          </div>
        )}

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
