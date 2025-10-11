import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface YieldDepositModalProps {
  protocol: string;
  token: string;
  chain: string;
  amount: number;
  apy: number;
  isOpen: boolean;
  onClose: () => void;
}

export function YieldDepositModal({
  protocol,
  token,
  chain,
  amount,
  apy,
  isOpen,
  onClose
}: YieldDepositModalProps) {
  const [isDepositing, setIsDepositing] = useState(false);

  const handleDeposit = async () => {
    setIsDepositing(true);
    
    try {
      toast({
        title: "Coming Soon",
        description: `Direct protocol deposits will be available soon. For now, visit ${protocol} directly to deposit.`,
      });
      
      // In production, call protocol-specific deposit functions:
      // if (protocol.includes('Aave')) {
      //   await depositToAave(token, amount, chain);
      // } else if (protocol.includes('Compound')) {
      //   await depositToCompound(token, amount, chain);
      // }
      
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Deposit error:', error);
      toast({
        title: "Deposit failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsDepositing(false);
    }
  };

  const getProtocolUrl = () => {
    const urls: Record<string, string> = {
      'Aave': 'https://app.aave.com',
      'Compound': 'https://app.compound.finance',
      'Curve': 'https://curve.fi',
      'Lido': 'https://lido.fi',
      'Uniswap': 'https://app.uniswap.org',
    };
    
    for (const [key, url] of Object.entries(urls)) {
      if (protocol.includes(key)) return url;
    }
    return '#';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" aria-describedby="deposit-description">
        <DialogHeader>
          <DialogTitle>Complete Yield Deposit</DialogTitle>
          <DialogDescription id="deposit-description">
            Your assets have been bridged to {chain}. 
            Now deposit into {protocol} to start earning {apy}% APY.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Protocol:</span>
              <span className="font-medium">{protocol}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Token:</span>
              <span className="font-medium">{token}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">{amount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Expected APY:</span>
              <span className="font-medium text-green-500">{apy}%</span>
            </div>
          </div>

          <div className="space-y-2">
            <Button 
              onClick={handleDeposit} 
              disabled={isDepositing}
              className="w-full"
            >
              {isDepositing ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Depositing...</>
              ) : (
                <>Deposit {amount} {token} into {protocol}</>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              asChild
            >
              <a 
                href={getProtocolUrl()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2"
              >
                Open {protocol} App
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
