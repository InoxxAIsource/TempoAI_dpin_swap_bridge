import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ExternalLink } from 'lucide-react';

interface GasAlertCardProps {
  chain: string;
  currentGas: number;
  requiredGas: number;
  gasSymbol: string;
  onDismiss?: () => void;
}

const GasAlertCard = ({
  chain,
  currentGas,
  requiredGas,
  gasSymbol,
  onDismiss,
}: GasAlertCardProps) => {
  const deficit = requiredGas - currentGas;

  const getFaucetLinks = () => {
    const links = {
      'Ethereum': 'https://sepoliafaucet.com/',
      'Polygon': 'https://faucet.polygon.technology/',
      'Arbitrum': 'https://bridge.arbitrum.io/',
      'Optimism': 'https://app.optimism.io/bridge',
      'Avalanche': 'https://core.app/tools/testnet-faucet/',
      'Solana': 'https://faucet.solana.com/',
    };

    return links[chain as keyof typeof links] || 'https://uniswap.org/';
  };

  return (
    <Alert variant="destructive" className="border-orange-500/50 bg-orange-500/10">
      <AlertTriangle className="h-4 w-4 text-orange-500" />
      <AlertTitle className="text-orange-700 dark:text-orange-400">
        Insufficient Gas on {chain}
      </AlertTitle>
      <AlertDescription className="space-y-3 mt-2">
        <div className="text-sm">
          <p>You need <span className="font-semibold">{deficit.toFixed(6)} {gasSymbol}</span> more to complete this transaction.</p>
          <p className="text-muted-foreground mt-1">
            Current: {currentGas.toFixed(6)} {gasSymbol} | Required: {requiredGas.toFixed(6)} {gasSymbol}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => window.open(getFaucetLinks(), '_blank')}
          >
            Get {gasSymbol}
            <ExternalLink className="h-3 w-3" />
          </Button>
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
            >
              Dismiss
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default GasAlertCard;
