import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { useAccount, useWriteContract, useSwitchChain, useWaitForTransactionReceipt } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { getFaucetContractConfig } from '@/lib/contracts/faucetInteraction';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DePINClaimInfoCardProps {
  claimId: string;
  sepoliaEthAmount: number | null;
  contractPreparedAt: string | null;
  onContractPrepared: () => void;
}

const DePINClaimInfoCard = ({ 
  claimId, 
  sepoliaEthAmount, 
  contractPreparedAt,
  onContractPrepared 
}: DePINClaimInfoCardProps) => {
  const [preparing, setPreparing] = useState(false);
  const [calculatedAmount, setCalculatedAmount] = useState<string | null>(
    sepoliaEthAmount ? sepoliaEthAmount.toString() : null
  );
  
  const { address, chain } = useAccount();
  const { toast } = useToast();
  const { switchChain } = useSwitchChain();
  const { writeContract, data: hash, isPending: isWritePending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Prepare claim calculation
  const handlePrepareCalculation = async () => {
    setPreparing(true);
    try {
      const { data, error } = await supabase.functions.invoke('prepare-claim-funds', {
        body: { claimId },
      });

      if (error) throw error;

      setCalculatedAmount(data.sepoliaEthAmount);
      toast({
        title: "Calculation Complete",
        description: `${data.sepoliaEthAmount} ETH required on Sepolia`,
      });
    } catch (error) {
      console.error('Error preparing claim:', error);
      toast({
        title: "Calculation Failed",
        description: error instanceof Error ? error.message : "Failed to calculate amount",
        variant: "destructive",
      });
    } finally {
      setPreparing(false);
    }
  };

  // Execute contract call
  const handlePrepareContract = async () => {
    if (!address || !calculatedAmount) {
      toast({
        title: "Error",
        description: "Wallet not connected or amount not calculated",
        variant: "destructive",
      });
      return;
    }

    // Switch to Sepolia if needed
    if (chain?.id !== sepolia.id) {
      try {
        await switchChain({ chainId: sepolia.id });
      } catch (error) {
        console.error('Failed to switch chain:', error);
        toast({
          title: "Chain Switch Failed",
          description: "Please switch to Sepolia network manually",
          variant: "destructive",
        });
        return;
      }
    }

    // Execute the contract call
    const contractConfig = getFaucetContractConfig(address, calculatedAmount);
    writeContract({
      ...contractConfig,
      account: address,
      chain: sepolia,
    });
  };

  // Update database after successful transaction
  useEffect(() => {
    const updateDatabase = async () => {
      if (isConfirmed && hash) {
        try {
          // Update wormhole_transactions
          const { data: wormholeTx } = await supabase
            .from('wormhole_transactions')
            .select('id')
            .eq('id', (await supabase
              .from('depin_reward_claims')
              .select('wormhole_tx_id')
              .eq('id', claimId)
              .single()
            ).data?.wormhole_tx_id || '')
            .single();

          if (wormholeTx) {
            await supabase
              .from('wormhole_transactions')
              .update({
                contract_claim_tx: hash,
                contract_claim_status: 'completed',
                contract_address: '0xb90bb7616bc138a177bec31a4571f4fd8fe113a1',
              })
              .eq('id', wormholeTx.id);
          }

          toast({
            title: "Contract Prepared!",
            description: "Funds are now ready for bridging",
          });

          onContractPrepared();
        } catch (error) {
          console.error('Error updating database:', error);
        }
      }
    };

    updateDatabase();
  }, [isConfirmed, hash, claimId, onContractPrepared, toast]);

  // Show error if transaction fails
  useEffect(() => {
    if (writeError) {
      toast({
        title: "Transaction Failed",
        description: writeError.message,
        variant: "destructive",
      });
    }
  }, [writeError, toast]);

  if (contractPreparedAt) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Contract prepared successfully! You can now proceed to bridge your funds.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Step 1: Prepare Smart Contract
        </CardTitle>
        <CardDescription>
          Prepare the Sepolia testnet contract to enable your claim
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!calculatedAmount && (
          <Button 
            onClick={handlePrepareCalculation} 
            disabled={preparing}
            className="w-full"
          >
            {preparing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Calculate Required Amount
          </Button>
        )}

        {calculatedAmount && (
          <>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Sepolia ETH Required</div>
              <div className="text-2xl font-bold">{calculatedAmount} ETH</div>
            </div>

            {!address && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please connect your wallet to continue
                </AlertDescription>
              </Alert>
            )}

            {address && chain?.id !== sepolia.id && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You need to switch to Sepolia network
                </AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handlePrepareContract}
              disabled={!address || isWritePending || isConfirming}
              className="w-full"
            >
              {(isWritePending || isConfirming) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isWritePending && "Confirm in Wallet..."}
              {isConfirming && "Confirming Transaction..."}
              {!isWritePending && !isConfirming && "Prepare Contract"}
            </Button>

            {hash && (
              <Alert>
                <ExternalLink className="h-4 w-4" />
                <AlertDescription className="flex items-center gap-2">
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View on Etherscan
                  </a>
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DePINClaimInfoCard;
