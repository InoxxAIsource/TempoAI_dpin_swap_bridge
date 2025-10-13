import { ArrowUpRight } from 'lucide-react';
import ChainBadge from '../ui/ChainBadge';

interface AssetCardProps {
  name: string;
  symbol: string;
  balance: string;
  value: string;
  chain: string;
  change: string;
  changeType: 'positive' | 'negative';
}

const AssetCard = ({ name, symbol, balance, value, chain, change, changeType }: AssetCardProps) => {
  return (
    <div className="border border-border rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 bg-card transition-all duration-300 hover:border-primary/50 group cursor-pointer">
      <div className="flex items-start justify-between mb-4 md:mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-base md:text-lg font-bold">{symbol.charAt(0)}</span>
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold">{name}</h3>
              <p className="text-xs md:text-sm text-muted-foreground">{symbol}</p>
            </div>
          </div>
        </div>
        <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="space-y-2 md:space-y-3">
        <div>
          <p className="text-xs md:text-sm text-muted-foreground mb-1">Balance</p>
          <p className="text-xl md:text-2xl font-bold">{balance}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Value</p>
            <p className="text-base md:text-lg font-semibold">{value}</p>
          </div>
          <div className={`text-sm font-medium ${
            changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {change}
          </div>
        </div>
        
        <div className="pt-3 border-t border-border">
          <ChainBadge chain={chain} />
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
