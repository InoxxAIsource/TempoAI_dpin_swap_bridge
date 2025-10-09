import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { fetchTokenLogo, getSupportedTokens } from '@/utils/coingecko';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TokenSelectorProps {
  selectedToken: string;
  onSelectToken: (token: string) => void;
}

const TokenSelector = ({ selectedToken, onSelectToken }: TokenSelectorProps) => {
  const [tokenLogos, setTokenLogos] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  
  const tokens = getSupportedTokens();

  useEffect(() => {
    const loadLogos = async () => {
      setLoading(true);
      const logos: Record<string, string> = {};
      
      // Load all logos in parallel
      await Promise.all(
        tokens.map(async (token) => {
          const logo = await fetchTokenLogo(token);
          if (logo) {
            logos[token] = logo;
          }
        })
      );
      
      setTokenLogos(logos);
      setLoading(false);
    };

    loadLogos();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-full hover:border-primary/50 transition-all duration-300 flex-shrink-0 bg-card">
          {loading || !tokenLogos[selectedToken] ? (
            <div className="w-5 h-5 rounded-full bg-muted animate-pulse" />
          ) : (
            <img
              src={tokenLogos[selectedToken]}
              alt={selectedToken}
              className="w-5 h-5 rounded-full object-cover"
            />
          )}
          <span className="font-medium whitespace-nowrap">{selectedToken}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-card border-border z-50">
        {tokens.map((token) => (
          <DropdownMenuItem
            key={token}
            onClick={() => onSelectToken(token)}
            className={cn(
              "flex items-center gap-3 cursor-pointer",
              selectedToken === token && "bg-primary/10 text-primary"
            )}
          >
            {loading || !tokenLogos[token] ? (
              <div className="w-5 h-5 rounded-full bg-muted animate-pulse" />
            ) : (
              <img
                src={tokenLogos[token]}
                alt={token}
                className="w-5 h-5 rounded-full object-cover"
              />
            )}
            <span className="font-medium">{token}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TokenSelector;
