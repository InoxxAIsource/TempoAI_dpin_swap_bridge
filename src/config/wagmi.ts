import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, arbitrum, avalanche, bsc, optimism, base, sepolia } from 'wagmi/chains';

// Mobile-optimized configuration with WalletConnect support
export const config = getDefaultConfig({
  appName: 'Tempo',
  projectId: '7cb724bf60c8e3b1b67fdadd7bafcace', // WalletConnect project ID for mobile deep linking
  chains: [mainnet, polygon, arbitrum, avalanche, bsc, optimism, base, sepolia],
  ssr: false,
});
