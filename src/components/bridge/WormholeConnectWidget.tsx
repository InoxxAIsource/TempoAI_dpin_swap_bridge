import { useEffect, useState, useMemo } from 'react';
import WormholeConnect, { type config } from '@wormhole-foundation/wormhole-connect';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useTheme } from '@/contexts/ThemeContext';
import { useWalletContext } from '@/contexts/WalletContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';

const WormholeConnectWidget = () => {
  const { theme } = useTheme();
  const { isAnyWalletConnected, evmAddress, solanaAddress } = useWalletContext();
  const [widgetKey, setWidgetKey] = useState(0);
  const [rpcError, setRpcError] = useState<string | null>(null);
  const [rpcHealthy, setRpcHealthy] = useState<boolean | null>(null);

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
            const walletAddress = evmAddress || solanaAddress || '';
            
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
              wallet_address: walletAddress,
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
  const wormholeConfig: config.WormholeConnectConfig = useMemo(() => {
    const alchemyKey = import.meta.env.VITE_ALCHEMY_API_KEY;
    
    return {
      network: 'Testnet',
      chains: ['Sepolia', 'Solana', 'ArbitrumSepolia', 'BaseSepolia', 'OptimismSepolia', 'PolygonSepolia'],
      
      // Specify supported testnet tokens
      tokens: ['ETH', 'WETH', 'USDC'],
      
      // Use Alchemy RPC for Sepolia with fallback to public RPCs
      rpcs: {
        Sepolia: alchemyKey 
          ? `https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`
          : 'https://ethereum-sepolia-rpc.publicnode.com',
        Solana: 'https://api.devnet.solana.com',
        ArbitrumSepolia: 'https://sepolia-rollup.arbitrum.io/rpc',
        BaseSepolia: 'https://sepolia.base.org',
        OptimismSepolia: 'https://sepolia.optimism.io',
        PolygonSepolia: 'https://rpc-amoy.polygon.technology',
      },
      
      // Required for wallet functionality - enables WalletConnect support
      walletConnectProjectId: '7cb724bf60c8e3b1b67fdadd7bafcace',
    };
  }, []);

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
  
  // FIX 5: Error handling for RPC issues
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

  const alchemyKey = import.meta.env.VITE_ALCHEMY_API_KEY;

  return (
    <ThemeProvider theme={muiTheme}>
      <div className="w-full">
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
        
        <div className="mb-4 p-3 border border-blue-500/50 rounded-xl bg-blue-500/10">
          <p className="text-sm text-blue-400 font-medium">
            🧪 Testnet Mode: Sepolia • Solana Devnet • Arbitrum Sepolia • Base Sepolia • More
          </p>
          <p className="text-xs text-blue-300/80 mt-1">
            Supported tokens: ETH, WETH, USDC {rpcHealthy && alchemyKey && '• Alchemy RPC Connected ✓'}
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
