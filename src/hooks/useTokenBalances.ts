import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TokenBalance {
  symbol: string;
  balance: string;
  raw: string;
}

interface TokenBalances {
  nativeBalance: string;
  wethBalance: string;
  usdcBalance: string;
  allTokens: TokenBalance[];
  isLoading: boolean;
  error: string | null;
}

export const useTokenBalances = (
  walletAddress: string | undefined,
  chainId: number | undefined
): TokenBalances => {
  const [balances, setBalances] = useState<TokenBalances>({
    nativeBalance: '0.0000',
    wethBalance: '0.0000',
    usdcBalance: '0.0000',
    allTokens: [],
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!walletAddress || !chainId) {
      setBalances({
        nativeBalance: '0.0000',
        wethBalance: '0.0000',
        usdcBalance: '0.0000',
        allTokens: [],
        isLoading: false,
        error: null,
      });
      return;
    }

    const fetchBalances = async () => {
      setBalances(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        const { data, error } = await supabase.functions.invoke('fetch-wallet-balances', {
          body: { walletAddress, chainId },
        });

        if (error) throw error;

        // Known token addresses on Sepolia
        const WETH_ADDRESSES = [
          '0xfff9976782d46cc05630d1f6ebab18b2324d6b14', // Sepolia WETH
          '0x7b79995e5f793a07bc00c21412e50ecae098e7f9', // Alternative Sepolia WETH
        ].map(addr => addr.toLowerCase());

        const USDC_ADDRESSES = [
          '0x1c7d4b196cb0c7b01d743fbc6116a902379c7238', // Sepolia USDC
          '0x94a9d9ac8a22534e3faca9f4e7f2e2cf85d5e4c8', // Alternative Sepolia USDC
        ].map(addr => addr.toLowerCase());

        const nativeBalance = data.nativeBalance?.toFixed(4) || '0.0000';
        let wethBalance = '0.0000';
        let usdcBalance = '0.0000';
        const allTokens: TokenBalance[] = [];

        // Parse ERC20 token balances
        if (data.tokens && Array.isArray(data.tokens)) {
          data.tokens.forEach((token: any) => {
            const tokenAddr = token.contractAddress?.toLowerCase();
            const balance = parseInt(token.tokenBalance, 16);
            
            if (balance > 0) {
              // Assume 18 decimals for most tokens, 6 for USDC
              const isUsdc = USDC_ADDRESSES.includes(tokenAddr);
              const decimals = isUsdc ? 6 : 18;
              const formattedBalance = (balance / Math.pow(10, decimals)).toFixed(4);

              if (WETH_ADDRESSES.includes(tokenAddr)) {
                wethBalance = formattedBalance;
                allTokens.push({ symbol: 'WETH', balance: formattedBalance, raw: token.tokenBalance });
              } else if (USDC_ADDRESSES.includes(tokenAddr)) {
                usdcBalance = formattedBalance;
                allTokens.push({ symbol: 'USDC', balance: formattedBalance, raw: token.tokenBalance });
              } else {
                allTokens.push({ 
                  symbol: 'TOKEN', 
                  balance: formattedBalance, 
                  raw: token.tokenBalance 
                });
              }
            }
          });
        }

        console.log('[useTokenBalances] Fetched balances:', {
          native: nativeBalance,
          weth: wethBalance,
          usdc: usdcBalance,
          allTokens: allTokens.length,
        });

        setBalances({
          nativeBalance,
          wethBalance,
          usdcBalance,
          allTokens,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        console.error('[useTokenBalances] Error:', err);
        setBalances(prev => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to fetch balances',
        }));
      }
    };

    fetchBalances();

    // Refresh every 30 seconds
    const interval = setInterval(fetchBalances, 30000);
    return () => clearInterval(interval);
  }, [walletAddress, chainId]);

  return balances;
};
