import { ChevronDown } from 'lucide-react';
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

// Token logos - using placeholder icons for now
const tokenInfo: Record<string, { symbol: string; name: string }> = {
  'USDC': { symbol: '💵', name: 'USD Coin' },
  'USDT': { symbol: '💲', name: 'Tether' },
  'ETH': { symbol: '⟠', name: 'Ethereum' },
  'WETH': { symbol: '⟠', name: 'Wrapped ETH' },
  'WBTC': { symbol: '₿', name: 'Wrapped Bitcoin' },
  'DAI': { symbol: '◈', name: 'Dai' },
};

const supportedTokens = ['USDC', 'USDT', 'ETH', 'WETH', 'WBTC', 'DAI'];

const TokenSelector = ({ selectedToken, onSelectToken }: TokenSelectorProps) => {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-full hover:border-primary/50 transition-all duration-300 flex-shrink-0 bg-card">
          <span className="text-lg">{tokenInfo[selectedToken]?.symbol}</span>
          <span className="font-medium whitespace-nowrap">{selectedToken}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-card border-border z-50">
        {supportedTokens.map((token) => (
          <DropdownMenuItem
            key={token}
            onClick={() => onSelectToken(token)}
            className={cn(
              "flex items-center gap-3 cursor-pointer",
              selectedToken === token && "bg-primary/10 text-primary"
            )}
          >
            <span className="text-lg">{tokenInfo[token]?.symbol}</span>
            <div className="flex flex-col">
              <span className="font-medium">{token}</span>
              <span className="text-xs text-muted-foreground">{tokenInfo[token]?.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TokenSelector;
