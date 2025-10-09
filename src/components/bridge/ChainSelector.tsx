import { cn } from '@/lib/utils';
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

interface ChainSelectorProps {
  selectedChain: string;
  onSelectChain: (chain: string) => void;
  excludeChain?: string;
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

const supportedChains = [
  'Ethereum', 'Polygon', 'Arbitrum', 'Avalanche', 'Solana', 'Optimism',
  'BNB Chain', 'Base', 'Fantom', 'Celo', 'Moonbeam', 'Aurora'
];

const ChainSelector = ({ selectedChain, onSelectChain, excludeChain }: ChainSelectorProps) => {
  const chains = supportedChains.filter(chain => chain !== excludeChain);

  return (
    <div className="relative">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scroll-smooth">
        {chains.map((chain) => (
          <button
            key={chain}
            onClick={() => onSelectChain(chain)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border transition-all duration-300 flex-shrink-0 hover:scale-105",
              selectedChain === chain
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card/80 hover:border-primary/50"
            )}
          >
            <img
              src={chainLogos[chain]}
              alt={chain}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="whitespace-nowrap">{chain}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChainSelector;
