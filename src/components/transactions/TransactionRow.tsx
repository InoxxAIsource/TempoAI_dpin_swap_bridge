import { ArrowRight, ExternalLink } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import ChainBadge from '../ui/ChainBadge';

interface TransactionRowProps {
  hash: string;
  type: string;
  from: string;
  to: string;
  amount: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
}

const TransactionRow = ({ hash, type, from, to, amount, status, timestamp }: TransactionRowProps) => {
  const shortHash = `${hash.slice(0, 6)}...${hash.slice(-4)}`;

  return (
    <div className="border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 group">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">{type}</span>
            <StatusBadge status={status} />
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <ChainBadge chain={from} />
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <ChainBadge chain={to} />
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <code className="bg-muted px-2 py-1 rounded">{shortHash}</code>
            <a 
              href={`https://wormholescan.io/#/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-primary transition-colors duration-300"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="text-right space-y-2">
          <div className="text-2xl font-bold">{amount}</div>
          <div className="text-sm text-muted-foreground">{timestamp}</div>
        </div>
      </div>
    </div>
  );
};

export default TransactionRow;
