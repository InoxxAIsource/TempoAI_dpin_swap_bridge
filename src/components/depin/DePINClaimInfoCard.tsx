import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, AlertCircle, ExternalLink, Link as LinkIcon, DollarSign, RefreshCcw } from 'lucide-react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useBalance } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useEvmWalletLink } from '@/hooks/useEvmWalletLink';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { TEMPO_DEPIN_FAUCET_ADDRESS, TEMPO_DEPIN_FAUCET_ABI } from '@/contracts/TempoDePINFaucet';
import { formatEther } from 'viem';

interface DePINClaimInfoCardProps {
  claimId: string;
  sepoliaEthAmount: number | null;
  contractPreparedAt: string | null;
  onContractPrepared: (ethAmount: number) => void;
}

const DePINClaimInfoCard = ({ 
  claimId, 
  sepoliaEthAmount, 
  contractPreparedAt,
  onContractPrepared 
}: DePINClaimInfoCardProps) => {
  const [preparing, setPreparing] = useState(false);
  const [contractPrepared, setContractPrepared] = useState(false);
  const [prepareTxHash, setPrepareTxHash] = useState<string | null>(null);
  const [ethAmount, setEthAmount] = useState<number | null>(null);
  const [useManualGas, setUseManualGas] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  
  const { address } = useAccount();
  const { toast } = useToast();
  const { isLinked, isLinking, linkError, linkEvmWallet } = useEvmWalletLink();

  // Check on-chain claimable amount - getClaimStatus returns [amount, claimed]
  const { data: onChainClaimStatus, isLoading: isLoadingClaimable, refetch: refetchClaimable } = useReadContract({
    address: TEMPO_DEPIN_FAUCET_ADDRESS,
    abi: TEMPO_DEPIN_FAUCET_ABI,
    functionName: 'getClaimStatus',
    args: address ? [address] : undefined,
    chainId: sepolia.id,
    query: {
      enabled: !!address && contractPrepared,
      refetchInterval: 15000, // Refetch every 15 seconds to allow state to settle
    }
  });

  // Check contract balance
  const { data: contractBalance } = useBalance({
    address: TEMPO_DEPIN_FAUCET_ADDRESS,
    chainId: sepolia.id,
    query: {
      enabled: contractPrepared,
      refetchInterval: 10000,
    }
  });

  // Wagmi hooks for claiming from smart contract
  const { writeContract, data: claimTxHash, isPending: isClaimPending, error: writeError } = useWriteContract();
  
  const { 
    isLoading: isClaimConfirming, 
    isSuccess: isClaimSuccess,
    isError: isClaimError,
    data: receiptData 
  } = useWaitForTransactionReceipt({
    hash: claimTxHash,
    confirmations: 2,
  });

  // Extract amount and claimed status from tuple [amount, claimed]
  const onChainClaimableAmount = onChainClaimStatus ? onChainClaimStatus[0] : BigInt(0);
  const hasAlreadyClaimed = onChainClaimStatus ? onChainClaimStatus[1] : false;
  
  // Check if claim is ready - don't block on verification if contract was prepared
  const isClaimReady = contractPrepared && prepareTxHash; // Just need contract prepared, not full verification
  const isVerified = onChainClaimableAmount && Number(onChainClaimableAmount) > 0;

  // Link wallet handler
  const handleLinkWallet = async () => {
    const success = await linkEvmWallet('Sepolia');
    if (success) {
      toast({
        title: 'Wallet Linked',
        description: 'Your EVM wallet has been linked to your account',
      });
    }
  };

  // Prepare smart contract
  const handlePrepareContract = async () => {
    if (!address) {
      toast({
        title: "Error",
        description: "Wallet not connected",
        variant: "destructive",
      });
      return;
    }

    if (!isLinked) {
      toast({
        title: 'Wallet Not Linked',
        description: 'Please link your EVM wallet first',
        variant: 'destructive',
      });
      return;
    }

    setPreparing(true);
    try {
      console.log('[DePINClaimInfoCard] Preparing smart contract...');
      
      const { data, error } = await supabase.functions.invoke('transfer-reward-eth', {
        body: {
          claimId,
          evmWalletAddress: address
        }
      });

      if (error) throw error;

      console.log('[DePINClaimInfoCard] Contract prepared:', data);
      
      setContractPrepared(true);
      setPrepareTxHash(data.prepareTxHash);
      setEthAmount(parseFloat(data.sepoliaEthAmount));
      
      // Refetch on-chain claimable amount to verify (progressive retry)
      setTimeout(() => refetchClaimable(), 5000);   // 5s
      setTimeout(() => refetchClaimable(), 15000);  // 15s
      setTimeout(() => refetchClaimable(), 30000);  // 30s
      setTimeout(() => refetchClaimable(), 60000);  // 60s
      
      toast({
        title: "Contract Prepared! ✅",
        description: `${parseFloat(data.sepoliaEthAmount).toFixed(6)} ETH is ready to claim. Verifying on-chain...`,
      });
    } catch (error: any) {
      console.error('Error preparing contract:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to prepare contract",
        variant: "destructive",
      });
    } finally {
      setPreparing(false);
    }
  };

  // User claims from smart contract
  const handleClaimFromContract = () => {
    if (!address) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    // Pre-flight balance check
    if (contractBalance && ethAmount) {
      const contractBalanceInEth = parseFloat(formatEther(contractBalance.value));
      if (contractBalanceInEth < ethAmount) {
        toast({
          title: "Insufficient Contract Balance",
          description: `Contract has ${contractBalanceInEth.toFixed(6)} ETH but you need ${ethAmount.toFixed(6)} ETH. Please contact support.`,
          variant: "destructive",
        });
        return;
      }
    }

    setClaimError(null);
    console.log('[DePINClaimInfoCard] User claiming from contract...');
    
    const config: any = {
      address: TEMPO_DEPIN_FAUCET_ADDRESS,
      abi: TEMPO_DEPIN_FAUCET_ABI,
      functionName: 'claimRewards',
      chain: sepolia,
      account: address,
    };

    // Add manual gas limit if enabled
    if (useManualGas) {
      config.gas = 100000n; // Set manual gas limit
      console.log('Using manual gas limit: 100000');
    }
    
    writeContract(config);
  };

  // Handle write errors
  useEffect(() => {
    if (writeError) {
      console.error('Claim error:', writeError);
      const errorMsg = writeError.message || 'Unknown error';
      
      if (errorMsg.includes('gas')) {
        setClaimError('Gas estimation failed. This usually means the transaction would revert. Try using manual gas limit or wait 30 seconds and retry.');
      } else {
        setClaimError(errorMsg);
      }
    }
  }, [writeError]);

  // Handle claim transaction result with comprehensive verification
  useEffect(() => {
    const verifyAndUpdateClaim = async () => {
      if (!claimTxHash || !ethAmount) return;

      // Check if transaction reverted
      if (isClaimError) {
        console.error('[DePINClaimInfoCard] ❌ Transaction reverted or failed');
        toast({
          title: "Claim Failed",
          description: "Transaction reverted. The contract may not have sufficient balance.",
          variant: "destructive",
        });
        return;
      }

      if (isClaimSuccess && receiptData) {
        console.log('[DePINClaimInfoCard] ✓ Transaction confirmed, verifying...');
        console.log('Receipt data:', receiptData);

        // Check receipt status
        if (receiptData.status === 'reverted') {
          console.error('[DePINClaimInfoCard] ❌ Receipt shows reverted transaction');
          toast({
            title: "Claim Failed",
            description: "Transaction was reverted. Contract may have insufficient funds.",
            variant: "destructive",
          });
          return;
        }

        // Verify RewardsClaimed event was emitted
        const claimEvent = receiptData.logs?.find((log: any) => {
          try {
            // RewardsClaimed event signature
            const eventSignature = '0x...'; // Event topic hash
            return log.topics[0] === eventSignature;
          } catch {
            return false;
          }
        });

        if (!claimEvent) {
          console.warn('[DePINClaimInfoCard] ⚠️ RewardsClaimed event not found in logs');
        }

        // Wait 5 seconds for blockchain state to settle
        console.log('[DePINClaimInfoCard] Waiting 5s for state to settle...');
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Verify on-chain status changed
        console.log('[DePINClaimInfoCard] Verifying on-chain claim status...');
        const { data: verifyStatus } = await refetchClaimable();
        
        if (verifyStatus) {
          const [amount, claimed] = verifyStatus as [bigint, boolean];
          console.log(`On-chain verification: amount=${formatEther(amount)}, claimed=${claimed}`);
          
          if (!claimed && Number(amount) > 0) {
            console.error('[DePINClaimInfoCard] ❌ On-chain status shows NOT claimed despite transaction success');
            toast({
              title: "Verification Failed",
              description: "Transaction succeeded but on-chain verification failed. Please contact support.",
              variant: "destructive",
            });
            return;
          }
        }

        // All checks passed - update database
        console.log('[DePINClaimInfoCard] ✓ All verifications passed, updating database...');
        const { error: updateError } = await supabase
          .from('depin_reward_claims')
          .update({
            user_claim_tx: claimTxHash,
            user_claim_confirmed_at: new Date().toISOString(),
            status: 'claimed'
          })
          .eq('id', claimId);

        if (updateError) {
          console.error('Failed to update claim:', updateError);
          toast({
            title: "Database Update Failed",
            description: "Claim succeeded but database update failed. Please contact support.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Claim Complete! 🎉",
          description: `Successfully claimed ${ethAmount.toFixed(6)} ETH from smart contract!`,
        });
        
        onContractPrepared(ethAmount);
      }
    };

    verifyAndUpdateClaim();
  }, [isClaimSuccess, isClaimError, receiptData, ethAmount, claimTxHash, claimId, onContractPrepared, toast, refetchClaimable]);

  // Contract Debug View Component
  const ContractDebugView = () => (
    <Alert className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
      <AlertDescription className="space-y-2">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Contract Debug Info
        </div>
        <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1 font-mono">
          <div>Contract: {TEMPO_DEPIN_FAUCET_ADDRESS}</div>
          <div>Contract Balance: {contractBalance ? formatEther(contractBalance.value) : '...'} ETH</div>
          <div>Your Claimable: {onChainClaimableAmount ? formatEther(onChainClaimableAmount) : '0'} ETH</div>
          <div>Expected Amount: {ethAmount?.toFixed(6) || '...'} ETH</div>
          <div>Already Claimed: {hasAlreadyClaimed ? 'Yes' : 'No'}</div>
        </div>
        <a 
          href={`https://sepolia.etherscan.io/address/${TEMPO_DEPIN_FAUCET_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
        >
          View Contract on Etherscan <ExternalLink className="h-3 w-3" />
        </a>
      </AlertDescription>
    </Alert>
  );

  // Show success state after claiming
  if (isClaimSuccess && ethAmount) {
    return (
      <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertDescription className="space-y-2">
          <div className="text-green-800 dark:text-green-200 font-semibold">
            ✓ Successfully Claimed from Smart Contract!
          </div>
          <div className="text-sm text-green-700 dark:text-green-300">
            {ethAmount.toFixed(6)} ETH claimed to your Sepolia wallet
          </div>
          {claimTxHash && (
            <a 
              href={`https://sepolia.etherscan.io/tx/${claimTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
            >
              View claim transaction <ExternalLink className="h-3 w-3" />
            </a>
          )}
          <div className="text-sm text-green-700 dark:text-green-300 mt-2">
            ETH transfer complete! Click "Proceed to Bridge" to continue.
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Step 1: Receive Reward on Sepolia
        </CardTitle>
        <CardDescription>
          Your DePIN rewards will be converted to ETH and sent to your Sepolia wallet
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
              Connect an EVM-compatible wallet (MetaMask, Rainbow, Coinbase Wallet, etc.) 
              to receive your rewards on Sepolia testnet.
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
              to receive rewards.
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
                  Link This Wallet
                </>
              )}
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-3 p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Wallet Connected</div>
                  <div className="font-mono text-sm">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </div>
                </div>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </div>

            {/* Step 1: Prepare Contract (backend sets claimable amount) */}
            {!contractPrepared && !prepareTxHash && (
              <>
                <Button 
                  onClick={handlePrepareContract}
                  disabled={preparing}
                  className="w-full"
                  size="lg"
                >
                  {preparing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Preparing Smart Contract...
                    </>
                  ) : (
                    <>
                      <DollarSign className="mr-2 h-4 w-4" />
                      Prepare Smart Contract
                    </>
                  )}
                </Button>
                <div className="text-xs text-muted-foreground text-center space-y-1">
                  <p>Your USDC rewards will be converted to ETH at current market price</p>
                  <p>The smart contract will be prepared for you to claim</p>
                </div>
              </>
            )}

            {/* Debug View */}
            {contractPrepared && <ContractDebugView />}

            {/* Step 2: User Claims from Contract */}
            {contractPrepared && !isClaimSuccess && (
              <div className="space-y-4">
                {/* Contract Preparation Status - Always show success if tx confirmed */}
                <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="space-y-2">
                    <div className="text-green-800 dark:text-green-200 font-semibold">
                      ✓ Contract Prepared Successfully!
                    </div>
                    <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <p>Expected amount: {ethAmount?.toFixed(6)} ETH</p>
                      {prepareTxHash && (
                        <a 
                          href={`https://sepolia.etherscan.io/tx/${prepareTxHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 flex items-center gap-1"
                        >
                          View preparation tx <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>

                {/* On-chain verification status - informational only */}
                {isLoadingClaimable ? (
                  <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                    <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                    <AlertDescription>
                      <div className="text-blue-800 dark:text-blue-200 font-semibold">
                        Verifying on-chain state...
                      </div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        This can take 30-60 seconds. You can try to claim now or wait for verification.
                      </div>
                    </AlertDescription>
                  </Alert>
                ) : !isVerified ? (
                  <Alert className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="space-y-2">
                      <div className="text-amber-800 dark:text-amber-200 font-semibold">
                        Verification Pending
                      </div>
                      <div className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                        <p>On-chain claimable: {onChainClaimableAmount ? formatEther(onChainClaimableAmount) : '0'} ETH</p>
                        <p className="mt-2">
                          Blockchain state is still settling. You can try to claim now, or wait 30-60 seconds for automatic verification.
                        </p>
                      </div>
                      <Button 
                        onClick={() => {
                          refetchClaimable();
                          toast({ title: "Refreshing...", description: "Checking on-chain state" });
                        }}
                        variant="outline"
                        size="sm"
                        className="mt-2"
                      >
                        <RefreshCcw className="mr-2 h-3 w-3" />
                        Check Now
                      </Button>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription>
                      <div className="text-green-800 dark:text-green-200 font-semibold">
                        ✓ Verified On-Chain!
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-300">
                        Claimable: {formatEther(onChainClaimableAmount!)} ETH
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Error display */}
                {claimError && (
                  <Alert className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="space-y-2">
                      <div className="text-red-800 dark:text-red-200 font-semibold">
                        Transaction Error
                      </div>
                      <div className="text-sm text-red-700 dark:text-red-300">
                        {claimError}
                      </div>
                      {!useManualGas && claimError.includes('gas') && (
                        <Button 
                          onClick={() => setUseManualGas(true)}
                          variant="outline"
                          size="sm"
                          className="mt-2"
                        >
                          Enable Manual Gas Limit
                        </Button>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Manual gas option */}
                {useManualGas && (
                  <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                    <AlertDescription>
                      <div className="text-sm text-blue-800 dark:text-blue-200">
                        Manual gas limit enabled (100,000 gas). This bypasses automatic estimation.
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  onClick={handleClaimFromContract}
                  disabled={isClaimPending || isClaimConfirming}
                  className="w-full"
                  size="lg"
                >
                  {isClaimPending || isClaimConfirming ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isClaimPending ? 'Approve in Wallet...' : 'Confirming Claim...'}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      {isVerified 
                        ? `Claim ${onChainClaimableAmount ? formatEther(onChainClaimableAmount) : ethAmount?.toFixed(6)} ETH`
                        : `Try Claim ${ethAmount?.toFixed(6)} ETH`
                      }
                    </>
                  )}
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  {!isVerified 
                    ? 'You can try claiming now. If it fails, wait 30-60 seconds and refresh.'
                    : 'Ready to claim your rewards from the smart contract'
                  }
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DePINClaimInfoCard;
