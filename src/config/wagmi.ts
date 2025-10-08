import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, arbitrum, avalanche, bsc, optimism, base } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Tempo',
  projectId: 'YOUR_PROJECT_ID', // Get from WalletConnect Cloud
  chains: [mainnet, polygon, arbitrum, avalanche, bsc, optimism, base],
  ssr: false,
});
