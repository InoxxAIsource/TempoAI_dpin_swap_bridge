import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface WormholeBridgeStatusProps {
  transaction: {
    id: string;
    tx_hash: string | null;
    status: string;
    wormhole_vaa: string | null;
    needs_redemption: boolean;
    from_chain: string;
    to_chain: string;
    amount: number;
    created_at: string;
  };
}

const WormholeBridgeStatus = ({ transaction }: WormholeBridgeStatusProps) => {
  const getMinutesElapsed = () => {
    const created = new Date(transaction.created_at);
    return Math.floor((Date.now() - created.getTime()) / (1000 * 60));
  };
  
  const minutesElapsed = getMinutesElapsed();
  
  // Status: Waiting for Finality (0-15 min)
  if (minutesElapsed < 15 && !transaction.wormhole_vaa) {
    return (
      <div className="flex items-start gap-3">
        <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
        <div className="flex-1">
          <p className="font-medium text-sm">Waiting for Blockchain Finality</p>
          <p className="text-xs text-muted-foreground mt-1">
            {15 - minutesElapsed} minutes remaining. Guardian verification will start after finality.
          </p>
        </div>
      </div>
    );
  }
  
  // Status: Guardian Verification (15-35 min)
  if (!transaction.wormhole_vaa && minutesElapsed >= 15) {
    return (
      <div className="flex items-start gap-3">
        <Clock className="w-5 h-5 text-yellow-500 mt-0.5 animate-pulse" />
        <div className="flex-1">
          <p className="font-medium text-sm">🔐 Guardian Verification in Progress</p>
          <p className="text-xs text-muted-foreground mt-1">
            Wormhole Guardians are signing your VAA. This typically takes 5-15 minutes.
          </p>
        </div>
      </div>
    );
  }
  
  // Status: Ready to Claim
  if (transaction.wormhole_vaa && transaction.needs_redemption) {
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-sm text-green-500">✅ Ready to Claim!</p>
            <p className="text-xs text-muted-foreground mt-1">
              VAA generated. Claim your {transaction.amount} ETH on {transaction.to_chain}.
            </p>
          </div>
        </div>
        <Button 
          size="sm" 
          variant="default"
          onClick={() => {
            const url = `https://wormholescan.io/#/tx/${transaction.tx_hash}?network=Testnet`;
            window.open(url, '_blank');
          }}
        >
          Claim on WormholeScan
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }
  
  // Status: Completed
  if (transaction.status === 'completed') {
    return (
      <div className="flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
        <div className="flex-1">
          <p className="font-medium text-sm text-green-500">✅ Claim Completed</p>
          <p className="text-xs text-muted-foreground mt-1">
            Successfully received on {transaction.to_chain}
          </p>
        </div>
      </div>
    );
  }
  
  return null;
};

export default WormholeBridgeStatus;
