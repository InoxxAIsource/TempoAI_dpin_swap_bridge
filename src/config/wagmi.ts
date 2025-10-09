import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, arbitrum, avalanche, bsc, optimism, base } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Tempo',
  projectId: '7cb724bf60c8e3b1b67fdadd7bafcace',
  chains: [mainnet, polygon, arbitrum, avalanche, bsc, optimism, base],
  ssr: false,
});
