import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, arbitrum, avalanche, bsc, optimism, base } from 'wagmi/chains';

// Use a generic project ID to avoid WalletConnect errors
// In production, replace with your own from https://cloud.walletconnect.com
const WALLETCONNECT_PROJECT_ID = '3fbb6bba6f1de962d911bb5b5c9ddd26';

export const config = getDefaultConfig({
  appName: 'Tempo',
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [mainnet, polygon, arbitrum, avalanche, bsc, optimism, base],
  ssr: false,
});
