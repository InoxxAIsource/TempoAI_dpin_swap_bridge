import { CheckCircle2, Clock, Loader2, ExternalLink } from 'lucide-react';

interface ClaimStatusTrackerProps {
  status: string;
  txHash?: string | null;
  vaa?: string | null;
  fromChain: string;
  toChain: string;
}

const ClaimStatusTracker = ({ status, txHash, vaa, fromChain, toChain }: ClaimStatusTrackerProps) => {
  const steps = [
    { 
      key: 'pending', 
      label: 'Pending Approval', 
      description: 'Waiting for bridge transaction'
    },
    { 
      key: 'claiming', 
      label: 'Initiating Bridge', 
      description: 'Transaction submitted to Wormhole'
    },
    { 
      key: 'in_transit', 
      label: 'In Transit', 
      description: 'Guardians verifying transfer'
    },
    { 
      key: 'ready', 
      label: 'Ready to Claim', 
      description: 'VAA available, ready for redemption'
    },
    { 
      key: 'claimed', 
      label: 'Claimed', 
      description: 'Successfully claimed on destination'
    },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === status) || 0;

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const isComplete = index < currentStepIndex;
        const isCurrent = index === currentStepIndex;
        const isPending = index > currentStepIndex;

        return (
          <div key={step.key} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              {isComplete ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : isCurrent ? (
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              ) : (
                <Clock className="w-6 h-6 text-muted-foreground" />
              )}
              {index < steps.length - 1 && (
                <div className={`w-0.5 h-8 mt-2 ${isComplete ? 'bg-green-500' : 'bg-border'}`} />
              )}
            </div>
            <div className="flex-1 pb-6">
              <div className="font-semibold">{step.label}</div>
              <div className="text-sm text-muted-foreground">{step.description}</div>
              {isCurrent && step.key === 'claiming' && txHash && (
                <a 
                  href={`https://wormholescan.io/#/tx/${txHash}?network=Testnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                >
                  View on WormholeScan <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ClaimStatusTracker;
