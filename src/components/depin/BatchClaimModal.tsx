import { useState, useEffect } from 'react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useWalletContext } from '@/contexts/WalletContext';
import BridgeFeeEstimator from '@/components/bridge/BridgeFeeEstimator';
import DePINClaimInfoCard from './DePINClaimInfoCard';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface BatchClaimModalProps {
  open: boolean;
  onClose: () => void;
  deviceBreakdown: Array<{
    deviceId: string;
    deviceName: string;
    amount: number;
  }>;
  totalAmount: number;
  requestedAmount: number | null;
  preferredChain: string;
  onSuccess: () => void;
}

const BatchClaimModal = ({
  open,
  onClose,
  deviceBreakdown,
  totalAmount,
  requestedAmount,
  preferredChain,
  onSuccess,
}: BatchClaimModalProps) => {
  const [loading, setLoading] = useState(false);
  const [feeEstimate, setFeeEstimate] = useState<any>(null);
  const [claimId, setClaimId] = useState<string | null>(null);
  const [sepoliaEthAmount, setSepoliaEthAmount] = useState<number | null>(null);
  const [contractPrepared, setContractPrepared] = useState(false);
  const [step, setStep] = useState<'create' | 'prepare' | 'bridge'>('create');
  const [autoSelectedDevices, setAutoSelectedDevices] = useState<string[]>([]);
  const [actualClaimAmount, setActualClaimAmount] = useState<number>(0);
  const { toast } = useToast();
  
  // Test mode configuration
  const TEST_MODE_MAX_CLAIM = 50;
  const isOverLimit = (actualClaimAmount || totalAmount) > TEST_MODE_MAX_CLAIM;
  const navigate = useNavigate();
  const { evmAddress, solanaAddress, walletAuthenticatedAddress } = useWalletContext();

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setStep('create');
      setClaimId(null);
      setSepoliaEthAmount(null);
      setContractPrepared(false);
    }
  }, [open]);

  const handleConfirmClaim = async () => {
    setLoading(true);
    try {
      const walletAddress = evmAddress || solanaAddress || walletAuthenticatedAddress;

      if (!walletAddress) {
        toast({
          title: "Error",
          description: "Please authenticate with your wallet first",
          variant: "destructive",
        });
        return;
      }

      console.log(`[BatchClaimModal] Creating claim:`, {
        requestedAmount: requestedAmount || 'ALL',
        totalAmount,
        preferredChain,
        walletAddress: walletAddress.substring(0, 10) + '...'
      });

      const { data, error } = await supabase.functions.invoke('create-batch-claim', {
        body: {
          claimAmount: requestedAmount || totalAmount,
          destinationChain: preferredChain,
          walletAddress,
        },
      });

      if (error) throw error;

      setAutoSelectedDevices(data.selectedDeviceIds || []);
      setActualClaimAmount(data.actualAmount || requestedAmount || totalAmount);

      console.log(`[BatchClaimModal] Claim created:`, {
        claimId: data.claimId,
        actualAmount: data.actualAmount,
        deviceCount: data.deviceCount,
        step: preferredChain === 'Solana' ? 'bridge (skip Sepolia)' : 'prepare'
      });

      toast({
        title: "✅ Claim Created Successfully!",
        description: `Selected ${data.deviceCount} device(s) for $${data.actualAmount.toFixed(2)}`,
      });

      setClaimId(data.claimId);
      
      // For Solana, skip the Sepolia contract preparation step
      if (preferredChain === 'Solana') {
        setStep('bridge');
        setContractPrepared(true);
      } else {
        setStep('prepare');
      }
    } catch (error: any) {
      console.error('[BatchClaimModal] Error creating batch claim:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to create claim. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContractPrepared = () => {
    setContractPrepared(true);
    setStep('bridge');
  };

  const handleProceedToBridge = () => {
    if (!claimId) return;
    
    const bridgeAmount = actualClaimAmount || totalAmount;
    console.log(`[BatchClaimModal] Proceeding to bridge with amount: $${bridgeAmount.toFixed(2)}`);
    
    onSuccess();
    onClose();

    // Redirect to bridge page with prefilled data
    navigate(`/bridge?amount=${bridgeAmount}&toChain=${preferredChain}&fromChain=Polygon&token=USDC&claimId=${claimId}`);
    
    setTimeout(() => {
      toast({
        title: "Complete Your Claim",
        description: "Connect your wallet in the bridge widget and confirm the transaction to receive your DePIN rewards.",
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Batch Claim Rewards - {step === 'create' ? 'Review Selection' : step === 'prepare' ? 'Step 1/2' : 'Step 2/2'}
          </DialogTitle>
          <DialogDescription>
            {step === 'create' && (requestedAmount 
              ? `Claiming $${requestedAmount.toFixed(2)} from auto-selected devices`
              : 'Review and confirm your cross-chain reward claim'
            )}
            {step === 'prepare' && 'Prepare the smart contract on Sepolia testnet'}
            {step === 'bridge' && 'Ready to bridge your funds'}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className={`flex items-center gap-2 ${step === 'create' ? 'text-primary' : 'text-green-600'}`}>
            {step !== 'create' && <CheckCircle2 className="h-5 w-5" />}
            <span className="text-sm font-medium">Create Claim</span>
          </div>
          <div className="h-px w-12 bg-border" />
          <div className={`flex items-center gap-2 ${step === 'prepare' ? 'text-primary' : step === 'bridge' ? 'text-green-600' : 'text-muted-foreground'}`}>
            {step === 'bridge' && <CheckCircle2 className="h-5 w-5" />}
            <span className="text-sm font-medium">Prepare Contract</span>
          </div>
          <div className="h-px w-12 bg-border" />
          <div className={`flex items-center gap-2 ${step === 'bridge' ? 'text-primary' : 'text-muted-foreground'}`}>
            <span className="text-sm font-medium">Bridge Funds</span>
          </div>
        </div>

        <div className="space-y-4">
          {step === 'create' && (
            <>
              {/* Test Mode Warning Banner */}
              <Alert className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 dark:text-amber-200">
                  <p className="font-medium mb-1">🧪 Test Mode Active</p>
                  <p className="text-sm">
                    Maximum claim amount is <strong>${TEST_MODE_MAX_CLAIM}</strong> for testing. 
                    {isOverLimit && (
                      <span className="block mt-1 text-amber-900 dark:text-amber-100 font-medium">
                        Current selection: ${(actualClaimAmount || totalAmount).toFixed(2)} - Please reduce amount
                      </span>
                    )}
                  </p>
                </AlertDescription>
              </Alert>

              <div className="rounded-lg border p-4 bg-muted/50">
                {requestedAmount ? (
                  <div className="mb-3">
                    <h3 className="font-semibold mb-2">Auto-Selected Devices</h3>
                    <p className="text-sm text-muted-foreground">
                      We selected the best combination to match your ${requestedAmount.toFixed(2)} request
                    </p>
                  </div>
                ) : (
                  <h3 className="font-semibold mb-3">Selected Devices ({deviceBreakdown.length})</h3>
                )}
                
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
                  <span className="text-2xl font-bold">${(actualClaimAmount || totalAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Destination Chain</span>
                  <span className="font-medium">{preferredChain}</span>
                </div>
              </div>

              <BridgeFeeEstimator
                amount={actualClaimAmount || totalAmount}
                fromChain="Polygon"
                toChain={preferredChain}
                token="USDC"
                onEstimateUpdate={setFeeEstimate}
              />

              {/* EVM Wallet Warning if not connected */}
              {!evmAddress && (solanaAddress || walletAuthenticatedAddress) && (
                <Alert className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800 dark:text-amber-200">
                    <p className="font-medium mb-2">EVM Wallet Needed for Next Step</p>
                    <p className="text-sm mb-3">
                      You'll need an EVM wallet (MetaMask, Rainbow, etc.) to prepare the smart contract on Sepolia testnet.
                    </p>
                    <div className="flex justify-center">
                      <ConnectButton />
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <Separator />

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={onClose} disabled={loading}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleConfirmClaim} 
                  disabled={loading || isOverLimit} 
                  className="gap-2"
                  title={isOverLimit ? `Reduce amount below $${TEST_MODE_MAX_CLAIM}` : ''}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating Claim...
                    </>
                  ) : (
                    <>
                      Create Claim
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </>
          )}

          {step === 'prepare' && claimId && (
            <>
              <DePINClaimInfoCard
                claimId={claimId}
                sepoliaEthAmount={sepoliaEthAmount}
                contractPreparedAt={contractPrepared ? new Date().toISOString() : null}
                onContractPrepared={handleContractPrepared}
              />
              <div className="flex gap-2 justify-end mt-4">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </>
          )}

          {step === 'bridge' && (
            <>
              <div className="p-6 bg-green-50 dark:bg-green-950 rounded-lg text-center">
                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Contract Prepared Successfully!</h3>
                <p className="text-muted-foreground mb-4">
                  Your claim is ready to bridge. Click below to proceed to the bridge interface.
                </p>
              </div>

              <Separator />

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button onClick={handleProceedToBridge} className="gap-2">
                  Proceed to Bridge
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BatchClaimModal;
