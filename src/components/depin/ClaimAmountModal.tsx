import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ArrowRight } from 'lucide-react';

interface ClaimAmountModalProps {
  open: boolean;
  onClose: () => void;
  totalAvailable: number;
  preferredChain: string;
  onAmountConfirmed: (amount: number) => void;
}

const ClaimAmountModal = ({
  open,
  onClose,
  totalAvailable,
  preferredChain,
  onAmountConfirmed,
}: ClaimAmountModalProps) => {
  const TEST_MODE_MAX_CLAIM = 50;
  const maxClaimable = Math.min(totalAvailable, TEST_MODE_MAX_CLAIM);
  
  const [claimAmount, setClaimAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    const amount = parseFloat(claimAmount);
    
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (amount < 1) {
      setError('Minimum claim amount is $1');
      return;
    }
    
    if (amount > maxClaimable) {
      setError(`Maximum claim amount is $${maxClaimable.toFixed(2)}`);
      return;
    }
    
    onAmountConfirmed(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Withdraw Rewards</DialogTitle>
          <DialogDescription>
            How much would you like to claim to {preferredChain}?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Test Mode Info */}
          <Alert className="bg-amber-50 dark:bg-amber-950 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-sm text-amber-800 dark:text-amber-200">
              <strong>🧪 Test Mode:</strong> Maximum $50 per claim
            </AlertDescription>
          </Alert>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount to Claim (USD)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="25.00"
              value={claimAmount}
              onChange={(e) => {
                setClaimAmount(e.target.value);
                setError(null);
              }}
              min={1}
              max={maxClaimable}
              step={0.01}
            />
            <p className="text-xs text-muted-foreground">
              Available: <strong>${totalAvailable.toFixed(2)}</strong> | 
              Max: <strong>${maxClaimable.toFixed(2)}</strong>
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Info */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-sm">
            <p className="text-blue-800 dark:text-blue-200">
              💡 We'll automatically select the best device combination to match your requested amount.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleContinue} className="gap-2">
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClaimAmountModal;
