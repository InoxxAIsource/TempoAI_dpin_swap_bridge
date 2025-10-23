import { useEffect, useMemo, useState, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import WormholeConnect, { config, WormholeConnectTheme } from '@wormhole-foundation/wormhole-connect';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useWalletContext } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { TransactionSuccessModal } from '@/components/bridge/TransactionSuccessModal';
import { ExternalLink } from 'lucide-react';
import { usePublicClient } from 'wagmi';
import { WormholeErrorBoundary } from './WormholeErrorBoundary';

interface WormholeSwapWidgetProps {
  defaultSourceChain?: string;
  defaultTargetChain?: string;
  defaultSourceToken?: string;
  defaultAmount?: string;
  claimId?: string;
}

export const WormholeSwapWidget = ({ 
  defaultSourceChain,
  defaultTargetChain,
  defaultSourceToken,
  defaultAmount,
  claimId
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
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [baselineNonce, setBaselineNonce] = useState<number | null>(null);
  const { theme: appTheme } = useTheme();
  const { toast } = useToast();
  const { evmAddress, solanaAddress } = useWalletContext();
  const lastSeenTxHash = useRef<string | null>(null);
  const publicClient = usePublicClient();

  // Force remount on initial load
  useEffect(() => {
    const timer = setTimeout(() => setWidgetKey(1), 100);
    return () => clearTimeout(timer);
  }, []);

  const WORMHOLE_CONTRACTS_LIST = {
    Testnet: ['0x4a8bc80Ed5a4067f1CCf107057b8270E0cC11A78', '0x0591C25ebd0580E0d4F27A82Fc2e24E7489CB5e0'],
    Mainnet: ['0x3ee18B2214AFF97000D974cf647E7C347E8fa585', '0xAaDA05BD399372f0b0463744C09113c137636f6a'],
  };

  // PRIMARY DETECTION: Wallet transaction monitoring using wagmi
  const startMonitoring = async () => {
    if (!evmAddress || !publicClient) {
      console.log('⏸️ Cannot start monitoring: no wallet or public client');
      return;
    }
    
    try {
      const nonce = await publicClient.getTransactionCount({
        address: evmAddress as `0x${string}`,
        blockTag: 'latest'
      });
      setBaselineNonce(nonce);
      setIsMonitoring(true);
      console.log('🔍 Wallet monitoring started. Baseline nonce:', nonce);
    } catch (error) {
      console.error('❌ Failed to start monitoring:', error);
      toast({
        title: "⚠️ Monitoring Failed",
        description: "Could not start transaction monitoring. Please reconnect your wallet.",
        variant: "destructive"
      });
    }
  };

  const checkForNewTransaction = async () => {
    if (!evmAddress || baselineNonce === null || !isMonitoring || !publicClient) return;

    try {
      console.log('🔄 Polling for new transactions... (nonce check)');
      
      const currentNonce = await publicClient.getTransactionCount({
        address: evmAddress as `0x${string}`,
        blockTag: 'latest'
      });

      if (currentNonce > baselineNonce) {
        console.log('🎯 NEW TX! Nonce increased:', baselineNonce, '->', currentNonce);
        
        const apiUrl = networkMode === 'Testnet' 
          ? 'https://api-sepolia.etherscan.io/api'
          : 'https://api.etherscan.io/api';
        
        const etherscanKey = import.meta.env.VITE_ETHERSCAN_API_KEY || '';
        console.log('📡 Fetching latest transaction from Etherscan...');
        
        const response = await fetch(
          `${apiUrl}?module=account&action=txlist&address=${evmAddress}&startblock=0&endblock=99999999&page=1&offset=1&sort=desc&apikey=${etherscanKey}`
        );

        if (!response.ok) {
          console.error('❌ Etherscan API error:', response.status, response.statusText);
          if (response.status === 429) {
            console.log('⏳ Rate limited. Retrying in 3 seconds...');
            toast({ 
              title: "⚠️ Rate Limit Hit", 
              description: "Transaction monitoring slowed. Add VITE_ETHERSCAN_API_KEY to .env for better performance.",
              variant: "destructive"
            });
            // Retry after delay
            setTimeout(checkForNewTransaction, 3000);
          }
          return;
        }
        
        const data = await response.json();
        
        if (data.status === '1' && data.result?.[0]) {
          const tx = data.result[0];
          console.log('📝 Latest transaction:', tx.hash, 'to:', tx.to);
          
          const isWormhole = WORMHOLE_CONTRACTS_LIST[networkMode].some(
            c => tx.to?.toLowerCase() === c.toLowerCase()
          );

          if (isWormhole) {
            console.log('✅ Wormhole TX detected:', tx.hash);
            
            // Update database
            if (claimId) {
              console.log('💾 Updating database with tx_hash...');
              const { error } = await supabase
                .from('wormhole_transactions')
                .update({ tx_hash: tx.hash, status: 'pending' })
                .eq('source_type', 'depin_rewards')
                .is('tx_hash', null)
                .eq('wallet_address', evmAddress.toLowerCase());
              
              if (error) {
                console.error('❌ Database update failed:', error);
              } else {
                console.log('✅ Database updated successfully!');
                toast({ title: "✅ Transaction Captured!", description: `Hash: ${tx.hash.slice(0,16)}...` });
              }
            }
            
            setIsMonitoring(false);
            setBaselineNonce(null);
          } else {
            console.log('ℹ️ Transaction is not a Wormhole transaction');
          }
        } else {
          console.log('⚠️ No transaction data returned from Etherscan');
        }
      }
    } catch (error) {
      console.error('❌ Error checking new tx:', error);
    }
  };

  // Poll for nonce changes every 2 seconds
  useEffect(() => {
    if (!isMonitoring) return;
    const interval = setInterval(checkForNewTransaction, 2000);
    return () => clearInterval(interval);
  }, [isMonitoring, baselineNonce, evmAddress]);

  // Start monitoring when wallet connects
  useEffect(() => {
    if (evmAddress && publicClient && !isMonitoring && baselineNonce === null) {
      startMonitoring();
    }
  }, [evmAddress, publicClient]);

  // Listen for swap events - multiple event sources and names
  useEffect(() => {
    const handleSwapEvent = async (event: any) => {
      console.log('🎯 Wormhole event received:', event);
      console.log('🎯 Event detail:', event.detail);
      console.log('🎯 Event type:', event.detail?.type);
      console.log('🎯 Transaction hash:', event.detail?.txHash);
      
      if (event.detail?.type === 'transfer' && event.detail?.txHash) {
        const txData = event.detail;
        const txHash = txData.txHash;
        const walletAddress = (evmAddress || solanaAddress || '').toLowerCase();
        
        // Store transaction details for modal immediately
        const transactionDetails = {
          hash: txHash,
          fromChain: txData.fromChain || 'Unknown',
          toChain: txData.toChain || 'Unknown',
          token: txData.fromToken || 'Unknown',
          amount: txData.amount || 0,
          network: networkMode,
        };
        
        setTxDetails(transactionDetails);
        setShowSuccessModal(true);
        
        // Generate WormholeScan URL
        const wormholeScanUrl = `https://wormholescan.io/#/tx/${txHash}?network=${networkMode}`;
        
        try {
          // If claimId exists, UPDATE existing wormhole_transactions record
          if (claimId) {
            console.log('[WormholeSwapWidget] Updating Wormhole transaction for DePIN claim:', claimId);
            console.log('[WormholeSwapWidget] Looking for source_type=depin_rewards with null tx_hash for wallet:', walletAddress);
            
            const { data: updateData, error: updateError } = await supabase
              .from('wormhole_transactions')
              .update({
                tx_hash: txHash,
                status: 'pending',
                wormhole_vaa: txData.vaa || null,
              })
              .eq('source_type', 'depin_rewards')
              .is('tx_hash', null)
              .eq('wallet_address', walletAddress)
              .order('created_at', { ascending: false })
              .limit(1)
              .select();
            
            if (updateError) {
              console.error('❌ Failed to update Wormhole transaction:', updateError);
              throw updateError;
            }
            
            console.log('[WormholeSwapWidget] Update result:', updateData);
            
            if (!updateData || updateData.length === 0) {
              console.error('❌ No wormhole_transactions record was updated with tx_hash');
              toast({
                title: "⚠️ Transaction Tracking Issue",
                description: (
                  <div className="space-y-2">
                    <p>Bridge started but tracking failed. Check WormholeScan.</p>
                    <a 
                      href={`https://wormholescan.io/#/tx/${txHash}?network=${networkMode}`}
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
            } else {
              console.log('✅ DePIN claim Wormhole transaction updated with bridge tx_hash:', updateData[0].id);
            }
            
            // Dispatch completion event
            window.dispatchEvent(new CustomEvent('wormhole-transfer-complete', {
              detail: { ...txData, claimId }
            }));
            
            toast({
              title: "🎉 Bridge Transaction Started!",
              description: "Your DePIN rewards are being bridged to Solana. Track progress in the Claim tab.",
            });
          } else {
            // Regular swap - save to cross_chain_swaps table
            const { error } = await supabase.from('cross_chain_swaps').insert({
              wallet_address: walletAddress,
              from_chain: transactionDetails.fromChain,
              to_chain: transactionDetails.toChain,
              from_token: transactionDetails.token,
              to_token: txData.toToken || 'Unknown',
              from_amount: transactionDetails.amount,
              estimated_to_amount: txData.estimatedAmount || 0,
              route_used: txData.route || {},
              tx_hash: txHash,
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
          }
        } catch (error) {
          console.error('Error handling swap event:', error);
          toast({
            title: "⚠️ Transaction Error",
            description: "Failed to track transaction. Check WormholeScan.",
            variant: "destructive",
          });
        }
      } else {
        console.warn('⚠️ Wormhole event missing required data:', {
          type: event.detail?.type,
          txHash: event.detail?.txHash,
          fullDetail: event.detail
        });
      }
    };

    // Listen to multiple possible event sources and event names
    const eventTargets = [window, document, window.parent];
    const eventNames = [
      'wormhole-transfer',
      'wormhole-transaction', 
      'wormholeTransferComplete',
      'transfer-complete',
      'bridge-complete'
    ];

    console.log('🎧 Setting up event listeners for:', eventNames);

    eventTargets.forEach(target => {
      eventNames.forEach(eventName => {
        target.addEventListener(eventName, handleSwapEvent as any);
      });
    });

    return () => {
      eventTargets.forEach(target => {
        eventNames.forEach(eventName => {
          target.removeEventListener(eventName, handleSwapEvent as any);
        });
      });
    };
  }, [evmAddress, solanaAddress, toast, networkMode, claimId]);

  // PostMessage listener for cross-origin events (Wormhole runs in iframe)
  useEffect(() => {
    const handlePostMessage = (event: MessageEvent) => {
      // Log all messages for debugging
      console.log('📨 PostMessage received:', event.origin, event.data);
      
      // Check if this is a Wormhole transaction message
      if (event.data?.type === 'wormhole-transaction' || 
          event.data?.txHash ||
          event.data?.transaction?.hash) {
        
        console.log('🎯 Wormhole transaction detected via postMessage:', event.data);
        
        const txHash = event.data.txHash || 
                       event.data.transaction?.hash || 
                       event.data.hash;
        
        if (txHash) {
          // Dispatch as a custom event to reuse existing handler
          const customEvent = new CustomEvent('wormhole-transfer', {
            detail: { 
              type: 'transfer',
              txHash,
              fromChain: event.data.fromChain || event.data.sourceChain,
              toChain: event.data.toChain || event.data.targetChain,
              fromToken: event.data.token || event.data.fromToken,
              amount: event.data.amount,
              ...event.data 
            }
          });
          window.dispatchEvent(customEvent);
        }
      }
    };
    
    window.addEventListener('message', handlePostMessage);
    return () => window.removeEventListener('message', handlePostMessage);
  }, []);

  // Improved transaction polling - detects NEW transactions for specific claim
  useEffect(() => {
    if (!claimId) return;
    
    console.log('[WormholeSwapWidget] Starting transaction polling for claimId:', claimId);
    
    const pollInterval = setInterval(async () => {
      try {
        const walletAddress = (evmAddress || solanaAddress || '').toLowerCase();
        
        // Query for THIS specific claim's transaction
        const { data: claimTx } = await supabase
          .from('wormhole_transactions')
          .select('tx_hash, id, created_at')
          .eq('source_type', 'depin_rewards')
          .contains('source_reference_ids', [claimId])
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (claimTx?.tx_hash && claimTx.tx_hash !== lastSeenTxHash.current) {
          console.log('✅ NEW transaction detected for this claim:', claimTx.tx_hash);
          lastSeenTxHash.current = claimTx.tx_hash;
          
          toast({
            title: "✅ Transaction Tracked!",
            description: `Bridge initiated: ${claimTx.tx_hash.slice(0, 10)}...`,
          });
          
          // Open WormholeScan in new tab
          window.open(
            `https://wormholescan.io/#/tx/${claimTx.tx_hash}?network=TESTNET`,
            '_blank'
          );
          
          clearInterval(pollInterval);
        } else {
          console.log('⏳ Waiting for transaction hash... Current:', claimTx?.tx_hash || 'null');
        }
      } catch (error) {
        console.log('⏳ No transaction record found yet for this claim');
      }
    }, 3000);
    
    return () => clearInterval(pollInterval);
  }, [claimId, evmAddress, solanaAddress, toast]);

  // Direct blockchain monitoring - fallback when Wormhole events don't fire
  useEffect(() => {
    if (!evmAddress || !claimId || typeof window === 'undefined' || !window.ethereum) return;
    
    let isMonitoring = true;
    let lastTxCount = 0;
    
    const monitorWallet = async () => {
      try {
        // Get current transaction count (nonce)
        const response = await fetch(
          `https://api-sepolia.etherscan.io/api?module=proxy&action=eth_getTransactionCount&address=${evmAddress}&tag=latest&apikey=${import.meta.env.VITE_ETHERSCAN_API_KEY || ''}`
        );
        const data = await response.json();
        
        if (data.result) {
          const txCount = parseInt(data.result, 16);
          
          if (lastTxCount > 0 && txCount > lastTxCount) {
            console.log('🔔 NEW transaction detected! Checking recent transactions...');
            
            // Fetch the latest transaction
            const txResponse = await fetch(
              `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${evmAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${import.meta.env.VITE_ETHERSCAN_API_KEY || ''}`
            );
            const txData = await txResponse.json();
            
            if (txData.result && txData.result[0]) {
              const latestTx = txData.result[0];
              console.log('📡 Latest transaction hash:', latestTx.hash);
              
              // Check if this transaction hasn't been assigned yet
              const { data: existingTx } = await supabase
                .from('wormhole_transactions')
                .select('id')
                .eq('tx_hash', latestTx.hash)
                .limit(1);
              
              if (!existingTx || existingTx.length === 0) {
                // Update the claim's wormhole_transactions record
                const { error } = await supabase
                  .from('wormhole_transactions')
                  .update({
                    tx_hash: latestTx.hash,
                    status: 'pending'
                  })
                  .eq('source_type', 'depin_rewards')
                  .contains('source_reference_ids', [claimId])
                  .is('tx_hash', null);
                
                if (!error) {
                  console.log('✅ Transaction captured via blockchain monitoring!');
                  toast({
                    title: "✅ Transaction Captured!",
                    description: `Hash: ${latestTx.hash.slice(0, 20)}...`
                  });
                }
              }
            }
          }
          
          lastTxCount = txCount;
        }
      } catch (error) {
        console.error('Wallet monitoring error:', error);
      }
      
      if (isMonitoring) {
        setTimeout(monitorWallet, 5000); // Check every 5 seconds
      }
    };
    
    monitorWallet();
    
    return () => { isMonitoring = false; };
  }, [evmAddress, claimId, toast]);

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
    
    // Build bridgeDefaults from props to pre-fill the form
    const bridgeDefaults: any = {};
    
    // Set chains first
    if (defaultSourceChain) {
      bridgeDefaults.fromChain = defaultSourceChain;
    }
    if (defaultTargetChain) {
      bridgeDefaults.toChain = defaultTargetChain;
    }
    
    // Only set token and amount AFTER chains are configured
    if (defaultSourceToken && defaultSourceChain && defaultTargetChain) {
      bridgeDefaults.token = defaultSourceToken;
    }
    if (defaultAmount && defaultSourceChain && defaultTargetChain) {
      bridgeDefaults.amount = String(defaultAmount);
      console.log('✅ Pre-filled widget with:', { 
        from: defaultSourceChain, 
        to: defaultTargetChain, 
        token: defaultSourceToken, 
        amount: defaultAmount 
      });
    }
    // Note: Removed route='bridge' to prevent "Can't call setAmount" errors
    // The widget will auto-detect the appropriate route type
    
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
        bridgeDefaults: Object.keys(bridgeDefaults).length > 0 ? bridgeDefaults : undefined,
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
      bridgeDefaults: Object.keys(bridgeDefaults).length > 0 ? bridgeDefaults : undefined,
    };
  }, [networkMode, defaultSourceChain, defaultTargetChain, defaultSourceToken, defaultAmount]);

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

        {/* Wormhole Widget with Error Boundary */}
        <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-lg">
          <WormholeErrorBoundary
            onError={(error) => {
              console.error('Wormhole Connect crashed:', error);
              toast({
                title: "⚠️ Widget Error",
                description: "The swap widget encountered an error. Try refreshing the page.",
                variant: "destructive"
              });
            }}
          >
            <WormholeConnect 
              key={`${networkMode.toLowerCase()}-swap-${widgetKey}`}
              config={wormholeConfig}
              theme={customWormholeTheme}
            />
          </WormholeErrorBoundary>
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
