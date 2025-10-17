import { cn } from '@/lib/utils';

interface BalanceDisplayProps {
  token: string;
  balance: string;
  address: string;
  className?: string;
}

export const BalanceDisplay = ({ token, balance, address, className }: BalanceDisplayProps) => {
  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  
  return (
    <div className={cn("flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border/50", className)}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-semibold">
          {token.slice(0, 1)}
        </div>
        <span className="text-sm font-medium">{token}</span>
      </div>
      <div className="text-right">
        <div className="text-xs text-muted-foreground">{truncatedAddress}</div>
        <div className="text-sm font-semibold">{balance} {token}</div>
      </div>
    </div>
  );
};
