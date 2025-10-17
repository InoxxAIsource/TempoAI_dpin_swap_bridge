import { TrendingUp } from 'lucide-react';

interface ConversionRateProps {
  fromToken: string;
  toToken: string;
  rate?: string;
  usdValue?: string;
}

export const ConversionRate = ({ fromToken, toToken, rate = '1.00', usdValue }: ConversionRateProps) => {
  return (
    <div className="flex items-center justify-between text-xs text-muted-foreground px-2 py-2 bg-muted/20 rounded-lg">
      <div className="flex items-center gap-1">
        <TrendingUp className="w-3 h-3" />
        <span>1 {fromToken} = {rate} {toToken}</span>
      </div>
      {usdValue && <span className="font-medium">${usdValue}</span>}
    </div>
  );
};
