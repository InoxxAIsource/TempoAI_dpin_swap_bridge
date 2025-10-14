import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useWalletContext } from '@/contexts/WalletContext';
import { Loader2, ArrowRight } from 'lucide-react';
import BridgeFeeEstimator from '@/components/bridge/BridgeFeeEstimator';

interface BatchClaimModalProps {
  open: boolean;
  onClose: () => void;
  deviceBreakdown: Array<{
    deviceId: string;
    deviceName: string;
    amount: number;
  }>;
  totalAmount: number;
  preferredChain: string;
  onSuccess: () => void;
}

const BatchClaimModal = ({
  open,
  onClose,
  deviceBreakdown,
  totalAmount,
  preferredChain,
  onSuccess,
}: BatchClaimModalProps) => {
  const [loading, setLoading] = useState(false);
  const [feeEstimate, setFeeEstimate] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { evmAddress, solanaAddress, walletAuthenticatedAddress } = useWalletContext();

  const handleConfirmClaim = async () => {
    setLoading(true);
    try {
      const deviceIds = deviceBreakdown.map(d => d.deviceId);
      // Priority: physical wallet connection > authenticated session address
      const walletAddress = evmAddress || solanaAddress || walletAuthenticatedAddress;

      if (!walletAddress) {
        toast({
          title: "Error",
          description: "Please authenticate with your wallet first",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-batch-claim', {
        body: {
          deviceIds,
          destinationChain: preferredChain,
          walletAddress,
        },
      });

      if (error) throw error;

      toast({
        title: "✅ Claim Initiated Successfully!",
        description: `Redirecting to bridge ${data.totalAmount} USDC to ${preferredChain}...`,
      });

      onSuccess();
      onClose();

      // Redirect to bridge page with prefilled data
      navigate(`/bridge?amount=${data.totalAmount}&toChain=${preferredChain}&fromChain=${data.fromChain}&token=${data.token}&claimId=${data.claimId}`);
      
      // Follow-up guidance after navigation
      setTimeout(() => {
        toast({
          title: "Complete Your Claim",
          description: "Connect your wallet in the bridge widget and confirm the transaction to receive your DePIN rewards.",
        });
      }, 2000);
    } catch (error) {
      console.error('Error creating batch claim:', error);
      toast({
        title: "Error",
        description: "Failed to create claim. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Batch Claim Rewards</DialogTitle>
          <DialogDescription>
            Review and confirm your cross-chain reward claim
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border p-4 bg-muted/50">
            <h3 className="font-semibold mb-3">Selected Devices ({deviceBreakdown.length})</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {deviceBreakdown.map((device) => (
                <div key={device.deviceId} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{device.deviceName}</span>
                  <span className="font-medium">${device.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Claimable</span>
              <span className="text-2xl font-bold">${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Destination Chain</span>
              <span className="font-medium">{preferredChain}</span>
            </div>
          </div>

          <BridgeFeeEstimator
            amount={totalAmount}
            fromChain="Polygon"
            toChain={preferredChain}
            token="USDC"
            onEstimateUpdate={setFeeEstimate}
          />

          <Separator />

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleConfirmClaim} disabled={loading} className="gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Confirm Claim
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BatchClaimModal;
