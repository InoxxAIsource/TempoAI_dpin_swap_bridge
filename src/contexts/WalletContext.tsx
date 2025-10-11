import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';

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
