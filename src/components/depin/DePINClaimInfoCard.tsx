import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, AlertCircle, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { useAccount, useWriteContract, useSwitchChain, useWaitForTransactionReceipt } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { getFaucetContractConfig } from '@/lib/contracts/faucetInteraction';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useEvmWalletLink } from '@/hooks/useEvmWalletLink';
import { ConnectButton } from '@rainbow-me/rainbowkit';

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
  const { isLinked, isLinking, linkError, linkEvmWallet } = useEvmWalletLink();
  const { switchChain } = useSwitchChain();
  const { writeContract, data: hash, isPending: isWritePending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Link wallet handler
  const handleLinkWallet = async () => {
    const success = await linkEvmWallet(chain?.name || 'Ethereum');
    if (success) {
      toast({
        title: 'Wallet Linked',
        description: 'Your EVM wallet has been linked to your account',
      });
    }
  };

  // Prepare claim calculation
  const handlePrepareCalculation = async () => {
    setPreparing(true);
    try {
      const { data, error } = await supabase.functions.invoke('prepare-claim-funds', {
        body: { 
          claimId,
          evmWalletAddress: address 
        },
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

    // Check if wallet is linked
    if (!isLinked) {
      toast({
        title: 'Wallet Not Linked',
        description: 'Please link your EVM wallet first',
        variant: 'destructive',
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
        {/* EVM Wallet Connection & Linking */}
        {!address ? (
          <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                EVM Wallet Required
              </h4>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              This step requires an EVM-compatible wallet (MetaMask, Rainbow, Coinbase Wallet, etc.) 
              to interact with the Sepolia testnet smart contract.
            </p>
            <div className="flex justify-center pt-2">
              <ConnectButton />
            </div>
          </div>
        ) : !isLinked ? (
          <div className="space-y-3 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-amber-600" />
              <h4 className="font-semibold text-amber-900 dark:text-amber-100">
                Link Your EVM Wallet
              </h4>
            </div>
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Connect this EVM wallet ({address.slice(0, 6)}...{address.slice(-4)}) to your account 
              to proceed with contract preparation.
            </p>
            {linkError && (
              <p className="text-sm text-red-600 dark:text-red-400">{linkError}</p>
            )}
            <Button 
              onClick={handleLinkWallet}
              disabled={isLinking}
              className="w-full"
            >
              {isLinking ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Linking Wallet...
                </>
              ) : (
                <>
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Link This Wallet to My Account
                </>
              )}
            </Button>
          </div>
        ) : null}

        {!calculatedAmount && isLinked && (
          <Button 
            onClick={handlePrepareCalculation} 
            disabled={preparing}
            className="w-full"
          >
            {preparing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Calculate Required Amount
          </Button>
        )}

        {calculatedAmount && isLinked && (
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
