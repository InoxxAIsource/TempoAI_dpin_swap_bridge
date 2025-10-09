import { useEffect, useState } from 'react';
import { fetchChainLogo, getSupportedChains } from '@/utils/coingecko';
import { cn } from '@/lib/utils';

interface ChainSelectorProps {
  selectedChain: string;
  onSelectChain: (chain: string) => void;
  excludeChain?: string;
}

const ChainSelector = ({ selectedChain, onSelectChain, excludeChain }: ChainSelectorProps) => {
  const [chainLogos, setChainLogos] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  
  const chains = getSupportedChains().filter(chain => chain !== excludeChain);

  useEffect(() => {
    const loadLogos = async () => {
      setLoading(true);
      const logos: Record<string, string> = {};
      
      // Load all logos in parallel
      await Promise.all(
        chains.map(async (chain) => {
          const logo = await fetchChainLogo(chain);
          if (logo) {
            logos[chain] = logo;
          }
        })
      );
      
      setChainLogos(logos);
      setLoading(false);
    };

    loadLogos();
  }, []);

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
            {loading || !chainLogos[chain] ? (
              <div className="w-6 h-6 rounded-full bg-muted animate-pulse" />
            ) : (
              <img
                src={chainLogos[chain]}
                alt={chain}
                className="w-6 h-6 rounded-full object-cover"
              />
            )}
            <span className="whitespace-nowrap">{chain}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChainSelector;
