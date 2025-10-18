import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, Copy, CheckCircle2, Clock } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface TransactionDetails {
  hash: string;
  fromChain: string;
  toChain: string;
  token: string;
  amount: number;
  network: 'Mainnet' | 'Testnet';
}

interface TransactionSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: TransactionDetails | null;
}

export const TransactionSuccessModal = ({ open, onOpenChange, transaction }: TransactionSuccessModalProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  if (!transaction) return null;

  const wormholeScanUrl = `https://wormholescan.io/#/tx/${transaction.hash}?network=${transaction.network}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transaction.hash);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Transaction hash copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy transaction hash",
        variant: "destructive",
      });
    }
  };

  const handleTrackOnWormhole = () => {
    window.open(wormholeScanUrl, '_blank');
  };

  const handleViewInApp = () => {
    window.location.href = '/claim';
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/10 rounded-full">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </div>
            <DialogTitle className="text-xl">Transaction Submitted!</DialogTitle>
          </div>
          <DialogDescription>
            Your cross-chain transfer has been initiated successfully
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Transaction Details */}
          <div className="p-4 bg-secondary/50 rounded-lg space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">From:</span>
              <span className="font-medium">{transaction.fromChain}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">To:</span>
              <span className="font-medium">{transaction.toChain}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">{transaction.amount} {transaction.token}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Network:</span>
              <span className="font-medium">{transaction.network}</span>
            </div>
          </div>

          {/* Transaction Hash */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Transaction Hash</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-secondary rounded text-xs font-mono overflow-x-auto">
                {transaction.hash}
              </code>
              <Button
                size="icon"
                variant="outline"
                onClick={handleCopy}
                className="flex-shrink-0"
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-500">
                <p className="font-medium mb-1">Estimated completion: 2-15 minutes</p>
                <p className="text-blue-500/80">Track progress on WormholeScan or check the Claims page</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={handleTrackOnWormhole}
              className="w-full"
              size="lg"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Track on WormholeScan
            </Button>
            <Button
              onClick={handleViewInApp}
              variant="outline"
              className="w-full"
            >
              View in Claims Page
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
