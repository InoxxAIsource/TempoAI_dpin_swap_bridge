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
  const [claimData, setClaimData] = useState<any>(null);
  const { toast } = useToast();
  
  // Test mode configuration
  const TEST_MODE_MAX_CLAIM = 50;
  const displayAmount = requestedAmount || actualClaimAmount || totalAmount;
  const isOverLimit = displayAmount > TEST_MODE_MAX_CLAIM;
  const navigate = useNavigate();
  const { evmAddress, solanaAddress, walletAuthenticatedAddress } = useWalletContext();

  // Log state on modal open for debugging
  useEffect(() => {
    if (open && step === 'create') {
      console.log(`[BatchClaimModal] Opened with:`, {
        requestedAmount,
        totalAmount,
        actualClaimAmount,
        displayAmount,
        deviceCount: deviceBreakdown.length,
        preferredChain
      });
    }
  }, [open, step, requestedAmount, totalAmount, actualClaimAmount, displayAmount, deviceBreakdown.length, preferredChain]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setStep('create');
      setClaimId(null);
      setSepoliaEthAmount(null);
      setContractPrepared(false);
      setClaimData(null);
    }
  }, [open]);

  // Fetch claim data from database
  const fetchClaimData = async (claimId: string) => {
    try {
      const { data, error } = await supabase
        .from('depin_reward_claims')
        .select('*')
        .eq('id', claimId)
        .single();
      
      if (error) throw error;
      
      console.log('[BatchClaimModal] Fetched claim data:', data);
      setClaimData(data);
      
      // Update local state if contract was already prepared
      if (data.contract_prepared_at && data.sepolia_eth_amount) {
        setSepoliaEthAmount(data.sepolia_eth_amount);
      }
    } catch (error) {
      console.error('[BatchClaimModal] Error fetching claim data:', error);
    }
  };

  // Poll claim data every 3 seconds when on 'prepare' step
  useEffect(() => {
    if (!claimId || step !== 'prepare') return;
    
    // Initial fetch
    fetchClaimData(claimId);
    
    // Poll every 3 seconds
    const interval = setInterval(() => {
      fetchClaimData(claimId);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [claimId, step]);

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
      
      // Always go to 'prepare' step to transfer ETH on Sepolia first
      setStep('prepare');
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

  const handleEthClaimed = async (ethAmount: number) => {
    setSepoliaEthAmount(ethAmount);
    setContractPrepared(true);
    setStep('bridge');
    
    // No need to create Wormhole transaction here - it's already created by create-batch-claim
    // and updated with tx_hash by transfer-reward-eth edge function
    console.log('[BatchClaimModal] ETH claimed, Wormhole transaction already tracked by backend');
  };

  const handleProceedToBridge = () => {
    if (!claimId || !sepoliaEthAmount) return;
    
    console.log(`[BatchClaimModal] Proceeding to bridge with ${sepoliaEthAmount.toFixed(6)} ETH from Sepolia to ${preferredChain}`);
    
    onSuccess();
    onClose();

    // Redirect to swap page with Sepolia ETH data
    navigate(`/swap?sourceChain=Sepolia&targetChain=${preferredChain}&sourceToken=ETH&amount=${sepoliaEthAmount.toFixed(6)}&claimId=${claimId}`);
    
    setTimeout(() => {
      toast({
        title: "Complete Your Claim",
        description: "Connect your wallet in the swap widget and complete the ETH → WETH swap to Solana to receive your DePIN rewards.",
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
              ? `Claiming $${requestedAmount.toFixed(2)} → Sepolia ETH → Bridge to ${preferredChain}`
              : `Review claim: Sepolia ETH → Bridge to ${preferredChain}`
            )}
            {step === 'prepare' && 'Receive ETH on Sepolia testnet for bridging'}
            {step === 'bridge' && `Ready to bridge from Sepolia to ${preferredChain}`}
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
                        Current selection: ${displayAmount.toFixed(2)} - Please reduce amount
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
                  <span className="text-2xl font-bold">${displayAmount.toFixed(2)}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Bridge Destination</span>
                    <span className="font-medium">{preferredChain}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Via Sepolia Testnet</span>
                    <span className="text-xs text-muted-foreground">ETH for gas</span>
                  </div>
                </div>
              </div>

              <BridgeFeeEstimator
                amount={displayAmount}
                fromChain="Sepolia"
                toChain={preferredChain}
                token="ETH"
                onEstimateUpdate={setFeeEstimate}
              />

              <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  <p className="text-sm font-medium mb-2">Two-Step Process:</p>
                  <ol className="text-xs space-y-1 ml-4 list-decimal">
                    <li>Claim rewards as ETH on Sepolia testnet (fees shown above)</li>
                    <li>Bridge ETH from Sepolia → {preferredChain} (additional fees apply)</li>
                  </ol>
                </AlertDescription>
              </Alert>

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
              {claimData && (
                <div className="mb-4">
                  <Alert className={claimData.contract_prepared_at ? "bg-green-50 dark:bg-green-950 border-green-200" : "bg-blue-50 dark:bg-blue-950 border-blue-200"}>
                    <AlertDescription>
                      {claimData.contract_prepared_at ? (
                        <>
                          <div className="flex items-center gap-2 text-green-700 dark:text-green-300 font-semibold mb-1">
                            <CheckCircle2 className="h-4 w-4" />
                            Contract Prepared Successfully!
                          </div>
                          <div className="text-sm text-green-600 dark:text-green-400">
                            {claimData.sepolia_eth_amount?.toFixed(6)} ETH ready to claim from smart contract
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-semibold mb-1">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Waiting for Contract Preparation
                          </div>
                          <div className="text-sm text-blue-600 dark:text-blue-400">
                            Click "Prepare Smart Contract" below to allocate your rewards
                          </div>
                        </>
                      )}
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              <DePINClaimInfoCard
                claimId={claimId}
                sepoliaEthAmount={claimData?.sepolia_eth_amount || sepoliaEthAmount}
                contractPreparedAt={claimData?.contract_prepared_at}
                onEthClaimedToWallet={handleEthClaimed}
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
