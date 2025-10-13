import { useMemo } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import '@rainbow-me/rainbowkit/styles.css';
import '@solana/wallet-adapter-react-ui/styles.css';

import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config/wagmi';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { WalletProvider } from './contexts/WalletContext';

// Suppress WalletConnect postMessage errors in iframe context
const originalError = console.error;
console.error = (...args) => {
  const errorMessage = args[0]?.toString() || '';
  if (
    errorMessage.includes('postMessage') ||
    errorMessage.includes('DataCloneError') ||
    errorMessage.includes('Failed to send message') ||
    errorMessage.includes('api.phantom.app') ||
    errorMessage.includes('Failed to load resource')
  ) {
    // Silently ignore these errors - they don't affect functionality
    return;
  }
  originalError.apply(console, args);
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const RootApp = () => {
  const solanaEndpoint = useMemo(() => clusterApiUrl('mainnet-beta'), []);
  const solanaWallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider>
          <ConnectionProvider endpoint={solanaEndpoint}>
            <SolanaWalletProvider wallets={solanaWallets} autoConnect={false}>
              <WalletModalProvider>
                <WalletProvider>
                  <App />
                </WalletProvider>
              </WalletModalProvider>
            </SolanaWalletProvider>
          </ConnectionProvider>
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<RootApp />);
