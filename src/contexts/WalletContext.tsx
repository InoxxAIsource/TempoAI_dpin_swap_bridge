import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';

interface WalletContextType {
  // EVM
  evmAddress: string | undefined;
  evmBalance: string | undefined;
  evmChainId: number | undefined;
  isEvmConnected: boolean;
  disconnectEvm: () => void;
  
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
      // Use Alchemy Solana RPC (no API key needed for mainnet reads)
      const connection = new Connection('https://solana-mainnet.g.alchemy.com/v2/demo');
      connection.getBalance(solanaPublicKey).then((balance) => {
        setSolanaBalance((balance / LAMPORTS_PER_SOL).toFixed(4));
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
    // Disconnect wallets
    if (isEvmConnected) disconnectEvm();
    if (isSolanaConnected) disconnectSolana();
    
    // Sign out from Supabase if authenticated via wallet
    if (authMethod === 'wallet') {
      await supabase.auth.signOut();
    }
    
    // Clear state
    setSession(null);
    setAuthMethod(null);
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
    evmBalance: evmBalanceData ? parseFloat(evmBalanceData.formatted).toFixed(4) : undefined,
    evmChainId,
    isEvmConnected,
    disconnectEvm,
    
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
