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

interface ChainBadgeProps {
  chain: string;
  className?: string;
}

const chainLogos: Record<string, string> = {
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

const ChainBadge = ({ chain, className = '' }: ChainBadgeProps) => {
  const logo = chainLogos[chain];
  
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border border-border bg-card/80 backdrop-blur-sm ${className}`}>
      {logo && (
        <img 
          src={logo} 
          alt={chain} 
          className="w-6 h-6 rounded-full flex-shrink-0 object-cover"
        />
      )}
      <span className="whitespace-nowrap">{chain}</span>
    </span>
  );
};

export default ChainBadge;
