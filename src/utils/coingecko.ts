// CoinGecko API utilities for fetching chain and token data

export interface ChainData {
  id: string;
  name: string;
  symbol: string;
  logo: string;
}

export interface TokenData {
  id: string;
  symbol: string;
  name: string;
  logo: string;
}

// Map chain names to CoinGecko IDs
const chainToCoinGeckoId: Record<string, string> = {
  'Ethereum': 'ethereum',
  'Polygon': 'matic-network',
  'Arbitrum': 'arbitrum',
  'Avalanche': 'avalanche-2',
  'Solana': 'solana',
  'Optimism': 'optimism',
  'BNB Chain': 'binancecoin',
  'Base': 'base',
  'Fantom': 'fantom',
  'Celo': 'celo',
  'Moonbeam': 'moonbeam',
  'Aurora': 'aurora-near',
};

// Map token symbols to CoinGecko IDs
const tokenToCoinGeckoId: Record<string, string> = {
  'USDC': 'usd-coin',
  'USDT': 'tether',
  'ETH': 'ethereum',
  'WETH': 'weth',
  'WBTC': 'wrapped-bitcoin',
  'DAI': 'dai',
};

// Cache for logos to avoid repeated API calls
const logoCache: Record<string, string> = {};

// Import local fallback logos
import ethereumLogo from '@/assets/chains/ethereum.png';
import polygonLogo from '@/assets/chains/polygon.png';
import arbitrumLogo from '@/assets/chains/arbitrum.png';
import avalancheLogo from '@/assets/chains/avalanche.png';
import solanaLogo from '@/assets/chains/solana.png';
import optimismLogo from '@/assets/chains/optimism.png';
import bnbLogo from '@/assets/chains/bnb.png';
import baseLogo from '@/assets/chains/base.png';
import fantomLogo from '@/assets/chains/fantom.png';
import celoLogo from '@/assets/chains/celo.png';
import moonbeamLogo from '@/assets/chains/moonbeam.png';
import auroraLogo from '@/assets/chains/aurora.png';

// Fallback logos map
const fallbackLogos: Record<string, string> = {
  'Ethereum': ethereumLogo,
  'Polygon': polygonLogo,
  'Arbitrum': arbitrumLogo,
  'Avalanche': avalancheLogo,
  'Solana': solanaLogo,
  'Optimism': optimismLogo,
  'BNB Chain': bnbLogo,
  'Base': baseLogo,
  'Fantom': fantomLogo,
  'Celo': celoLogo,
  'Moonbeam': moonbeamLogo,
  'Aurora': auroraLogo,
};

export const fetchChainLogo = async (chainName: string): Promise<string> => {
  const coinGeckoId = chainToCoinGeckoId[chainName];
  
  if (!coinGeckoId) {
    return fallbackLogos[chainName] || '';
  }

  // Check cache first
  if (logoCache[coinGeckoId]) {
    return logoCache[coinGeckoId];
  }

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinGeckoId}`,
      { signal: AbortSignal.timeout(5000) } // 5 second timeout
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch chain logo');
    }

    const data = await response.json();
    const logo = data.image?.large || data.image?.small || '';
    
    // Cache the result
    logoCache[coinGeckoId] = logo;
    
    return logo;
  } catch (error) {
    console.warn(`Using fallback logo for ${chainName}:`, error);
    // Return local fallback logo on error
    return fallbackLogos[chainName] || '';
  }
};

export const fetchTokenLogo = async (tokenSymbol: string): Promise<string> => {
  const coinGeckoId = tokenToCoinGeckoId[tokenSymbol];
  
  if (!coinGeckoId) {
    return '';
  }

  // Check cache first
  if (logoCache[coinGeckoId]) {
    return logoCache[coinGeckoId];
  }

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinGeckoId}`,
      { signal: AbortSignal.timeout(5000) } // 5 second timeout
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch token logo');
    }

    const data = await response.json();
    const logo = data.image?.large || data.image?.small || '';
    
    // Cache the result
    logoCache[coinGeckoId] = logo;
    
    return logo;
  } catch (error) {
    console.warn(`Error fetching logo for ${tokenSymbol}:`, error);
    return '';
  }
};

export const getSupportedChains = (): string[] => {
  return Object.keys(chainToCoinGeckoId);
};

export const getSupportedTokens = (): string[] => {
  return Object.keys(tokenToCoinGeckoId);
};
