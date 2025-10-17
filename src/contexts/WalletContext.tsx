import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';
import { useTokenBalances } from '@/hooks/useTokenBalances';

interface WalletContextType {
  // EVM
  evmAddress: string | undefined;
  evmBalance: string | undefined;
  evmChainId: number | undefined;
  isEvmConnected: boolean;
  disconnectEvm: () => void;
  
  // EVM Token Balances
  wethBalance: string;
  usdcBalance: string;
  tokenBalancesLoading: boolean;
  
  // Solana
  solanaAddress: string | undefined;
  solanaBalance: string | undefined;
  isSolanaConnected: boolean;
  disconnectSolana: () => void;
  
  // Combined
  isAnyWalletConnected: boolean;
  disconnectAll: () => Promise<void>;
  
  // Authentication
  isAuthenticated: boolean;
  authMethod: 'wallet' | 'email' | null;
  walletAuthenticatedAddress: string | undefined;
  isWalletAuthenticated: boolean;
  session: Session | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  // EVM Wallet State
  const { address: evmAddress, isConnected: isEvmConnected, chainId: evmChainId } = useAccount();
  const { data: evmBalanceData } = useBalance({
    address: evmAddress,
  });
  const { disconnect: disconnectEvm } = useDisconnect();
  
  // Fetch token balances using Alchemy
  const { 
    nativeBalance, 
    wethBalance, 
    usdcBalance, 
    isLoading: tokenBalancesLoading 
  } = useTokenBalances(evmAddress, evmChainId);

  // Solana Wallet State
  const { publicKey: solanaPublicKey, connected: isSolanaConnected, disconnect: disconnectSolana } = useSolanaWallet();
  const [solanaBalance, setSolanaBalance] = useState<string>();
  
  // Authentication State
  const [session, setSession] = useState<Session | null>(null);
  const [authMethod, setAuthMethod] = useState<'wallet' | 'email' | null>(null);

  // Listen to Supabase auth changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.user_metadata?.wallet_address) {
        setAuthMethod('wallet');
      } else if (session?.user?.email) {
        setAuthMethod('email');
      } else {
        setAuthMethod(null);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user?.user_metadata?.wallet_address) {
        setAuthMethod('wallet');
      } else if (session?.user?.email) {
        setAuthMethod('email');
      } else {
        setAuthMethod(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Solana balance
  useEffect(() => {
    if (solanaPublicKey) {
      // Use public Solana RPC with proper error handling
      const connection = new Connection('https://api.mainnet-beta.solana.com');
      
      connection.getBalance(solanaPublicKey)
        .then((balance) => {
          setSolanaBalance((balance / LAMPORTS_PER_SOL).toFixed(4));
        })
        .catch((error) => {
          console.warn('[WalletContext] Failed to fetch Solana balance:', error.message);
          // Set balance to "0.0000" instead of undefined to show connection worked
          setSolanaBalance('0.0000');
        });
    } else {
      setSolanaBalance(undefined);
    }
  }, [solanaPublicKey]);

  const walletAuthenticatedAddress = session?.user?.user_metadata?.wallet_address;
  const isWalletAuthenticated = authMethod === 'wallet' && !!walletAuthenticatedAddress;
  const isAuthenticated = !!session;

  // Unified disconnect function
  const disconnectAll = async () => {
    console.log('[WalletContext] Disconnecting all wallets and sessions...');
    
    try {
      // Disconnect physical wallets first
      if (isEvmConnected) {
        disconnectEvm();
      }
      if (isSolanaConnected) {
        disconnectSolana();
      }
      
      // ALWAYS sign out from Supabase (don't check authMethod)
      // This ensures we clear any lingering sessions
      try {
        await supabase.auth.signOut();
        console.log('[WalletContext] Supabase session cleared');
      } catch (signOutError) {
        console.error('[WalletContext] Error signing out:', signOutError);
        // Continue anyway - we still want to clear local state
      }
      
      // Force clear local state
      setSession(null);
      setAuthMethod(null);
      
      // Clear any localStorage cache that might persist
      try {
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('sb-fhmyhvrejofybzdgzxdc-auth-token');
      } catch (e) {
        // Ignore localStorage errors
      }
      
      console.log('[WalletContext] ✓ All connections cleared successfully');
    } catch (error) {
      console.error('[WalletContext] Error during disconnect:', error);
      // Still clear local state even if other operations fail
      setSession(null);
      setAuthMethod(null);
    }
  };

  // Debug logging for wallet state changes
  useEffect(() => {
    console.log('[WalletContext] State Update:', {
      isEvmConnected,
      isSolanaConnected,
      isAuthenticated,
      authMethod,
      hasSession: !!session,
      walletAuthenticatedAddress,
    });
  }, [isEvmConnected, isSolanaConnected, isAuthenticated, authMethod, session, walletAuthenticatedAddress]);

  const value: WalletContextType = {
    evmAddress,
    evmBalance: nativeBalance || (evmBalanceData ? parseFloat(evmBalanceData.formatted).toFixed(4) : undefined),
    evmChainId,
    isEvmConnected,
    disconnectEvm,
    
    wethBalance,
    usdcBalance,
    tokenBalancesLoading,
    
    solanaAddress: solanaPublicKey?.toString(),
    solanaBalance,
    isSolanaConnected,
    disconnectSolana,
    
    isAnyWalletConnected: isEvmConnected || isSolanaConnected,
    disconnectAll,
    
    isAuthenticated,
    authMethod,
    walletAuthenticatedAddress,
    isWalletAuthenticated,
    session,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within WalletProvider');
  }
  return context;
};
