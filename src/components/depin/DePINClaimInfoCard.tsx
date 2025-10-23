import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle2, AlertCircle, ExternalLink, Link as LinkIcon, DollarSign, RefreshCcw, Wallet, HelpCircle, Download, ArrowRight, Info } from 'lucide-react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useBalance } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useEvmWalletLink } from '@/hooks/useEvmWalletLink';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { TEMPO_DEPIN_FAUCET_ADDRESS, TEMPO_DEPIN_FAUCET_ABI } from '@/contracts/TempoDePINFaucet';
import { formatEther } from 'viem';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDistanceToNow } from 'date-fns';

interface DePINClaimInfoCardProps {
  claimId: string;
  sepoliaEthAmount: number | null;
  contractPreparedAt: string | null;
  onEthClaimedToWallet: (ethAmount: number) => void;
}

const DePINClaimInfoCard = ({ 
  claimId, 
  sepoliaEthAmount, 
  contractPreparedAt,
  onEthClaimedToWallet 
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
  
  // Ref for auto-scrolling to claim button
  const claimButtonRef = useRef<HTMLDivElement>(null);

  // Initialize state from props (when user returns to page after contract is prepared)
  useEffect(() => {
    if (contractPreparedAt) {
      console.log('[DePINClaimInfoCard] Contract already prepared at:', contractPreparedAt);
      setContractPrepared(true);
      
      // Also set ETH amount if provided
      if (sepoliaEthAmount) {
        setEthAmount(sepoliaEthAmount);
      }
    }
  }, [contractPreparedAt, sepoliaEthAmount]);

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
    setClaimError(null);
    
    try {
      console.log('[DePINClaimInfoCard] Preparing smart contract...');
      
      // Check if user already has claimable amount on-chain (shouldn't happen in V2 but good to check)
      if (onChainClaimableAmount && onChainClaimableAmount > 0n) {
        console.log(`[DePINClaimInfoCard] ⚠️ User already has ${formatEther(onChainClaimableAmount)} ETH claimable on-chain`);
        toast({
          title: 'Existing Claimable Amount',
          description: 'You already have ETH claimable from a previous preparation. Proceeding will overwrite it.',
          variant: 'default',
        });
      }
      
      const { data, error } = await supabase.functions.invoke('transfer-reward-eth', {
        body: {
          claimId,
          evmWalletAddress: address
        }
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to prepare contract');

      console.log('[DePINClaimInfoCard] Contract prepared:', data);
      
      setContractPrepared(true);
      setPrepareTxHash(data.prepareTxHash);
      setEthAmount(parseFloat(data.sepoliaEthAmount));
      
      // Refetch on-chain claimable amount to verify
      setTimeout(() => refetchClaimable(), 2000);
      
      // Auto-scroll to claim button after 1 second
      setTimeout(() => {
        claimButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 1000);
      
      toast({
        title: "Contract Prepared! ✅",
        description: `${parseFloat(data.sepoliaEthAmount).toFixed(6)} ETH is ready to claim!`,
      });
    } catch (error: any) {
      console.error('[DePINClaimInfoCard] Error preparing contract:', error);
      setClaimError(error.message);
      
      // Phase 3: Enhanced error handling for insufficient funds
      const errorMsg = error?.message || 'Failed to prepare contract';
      let toastDescription = errorMsg;
      
      if (errorMsg.includes('insufficient funds') || errorMsg.includes('INSUFFICIENT_FUNDS')) {
        toastDescription = 'System wallet needs refilling. The deployer wallet is out of test ETH. Please try again later or contact support.';
      } else if (errorMsg.includes('gas')) {
        toastDescription = 'Gas estimation failed. The system may need more Sepolia ETH for gas fees.';
      }
      
      toast({
        title: "Error",
        description: toastDescription,
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

  // Handle write errors with improved messages
  useEffect(() => {
    if (writeError) {
      console.error('Claim error:', writeError);
      const errorMsg = writeError.message || 'Unknown error';
      
      if (errorMsg.includes('User rejected') || errorMsg.includes('User denied')) {
        setClaimError('Transaction rejected. Please approve the transaction in MetaMask to claim your ETH.');
      } else if (errorMsg.includes('gas')) {
        setClaimError('Gas estimation failed. You may need more Sepolia ETH for gas (~$0.50). Try using manual gas limit or get test ETH from a faucet.');
      } else if (errorMsg.includes('network')) {
        setClaimError('Please make sure you are connected to Sepolia testnet in MetaMask.');
      } else if (errorMsg.includes('insufficient funds')) {
        setClaimError('Insufficient funds for gas. You need ~$0.50 in Sepolia ETH. Get free test ETH from a Sepolia faucet.');
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
        // Event signature: RewardsClaimed(address indexed user, uint256 amount)
        // keccak256("RewardsClaimed(address,uint256)") = 0x0f5bb82176feb1b5e747e28471aa92156a04d9f3ab9f45f28e2d704232b93f75
        const REWARDS_CLAIMED_EVENT = '0x0f5bb82176feb1b5e747e28471aa92156a04d9f3ab9f45f28e2d704232b93f75';
        
        const claimEvent = receiptData.logs?.find((log: any) => {
          try {
            return log.topics[0] === REWARDS_CLAIMED_EVENT;
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
          console.log(`[DePINClaimInfoCard] On-chain verification: amount=${formatEther(amount)}, claimed=${claimed}`);
          
          // In V2 contract, amount should be reset to 0 after successful claim
          if (amount > 0n) {
            console.warn('[DePINClaimInfoCard] ⚠️ Amount still claimable after claim - possible issue!');
          } else {
            console.log('[DePINClaimInfoCard] ✅ Amount properly reset to 0 after claim');
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
        
        // Notify parent that ETH has been claimed to wallet
        if (onEthClaimedToWallet) {
          onEthClaimedToWallet(ethAmount);
        }
      }
    };

    verifyAndUpdateClaim();
  }, [isClaimSuccess, isClaimError, receiptData, ethAmount, claimTxHash, claimId, onEthClaimedToWallet, toast, refetchClaimable]);

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
        <AlertDescription className="space-y-4">
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
          <div className="text-sm text-green-700 dark:text-green-300 mt-2 font-semibold">
            🎉 ETH transfer complete! Ready to swap to Solana.
          </div>
          {/* Add Bridge Button */}
          <Button
            onClick={() => {
              window.location.href = `/swap?claimId=${claimId}&sourceChain=Sepolia&targetChain=Solana&sourceToken=ETH&amount=${ethAmount.toFixed(6)}`;
            }}
            className="w-full mt-2"
            size="lg"
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            Proceed to Swap ETH
          </Button>
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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
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
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This allocates your ETH on the smart contract (no wallet interaction needed)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="text-xs text-muted-foreground text-center space-y-1">
                  <p>💡 Your USDC rewards will be converted to ETH at current market price</p>
                  <p>📝 After preparation, you'll need to claim the ETH to your wallet</p>
                </div>
              </>
            )}

            {/* Debug View */}
            {contractPrepared && <ContractDebugView />}

            {/* Step 2: User Claims from Contract */}
            {contractPrepared && !isClaimSuccess && (
              <div className="space-y-4" ref={claimButtonRef}>
                {/* Progress Indicator */}
                <div className="flex items-center justify-center gap-2 text-sm py-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-green-700 dark:text-green-300 font-medium">Contract Prepared</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-blue-600 animate-pulse" />
                    <span className="text-blue-700 dark:text-blue-300 font-medium">Claim ETH</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-muted-foreground/30" />
                    <span className="text-muted-foreground">Bridge to Solana</span>
                  </div>
                </div>

                {/* Prominent Action Required Alert */}
                <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950 border-2 animate-pulse">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  <AlertTitle className="text-blue-900 dark:text-blue-100 font-bold">
                    🎯 Action Required: Claim Your ETH
                  </AlertTitle>
                  <AlertDescription className="text-blue-800 dark:text-blue-200">
                    <p className="font-semibold">
                      Your {ethAmount?.toFixed(6)} ETH is ready on the Sepolia testnet!
                    </p>
                    <p className="mt-2">
                      Click the "Claim to Wallet" button below. This will open MetaMask for you to confirm the transaction.
                    </p>
                  </AlertDescription>
                </Alert>

                {/* Prominent Claimable Amount Display */}
                {isVerified && (
                  <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-2 border-green-300 dark:border-green-700 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">✅ Verified Claimable Amount</div>
                        <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                          {formatEther(onChainClaimableAmount)} ETH
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          ≈ ${ethAmount && (ethAmount * 3000).toFixed(2)} USD
                        </div>
                      </div>
                      <Wallet className="h-16 w-16 text-green-600 dark:text-green-400 opacity-20" />
                    </div>
                  </div>
                )}

                {/* What's Next Section */}
                <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      Contract Prepared Successfully!
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm font-semibold">What's Next?</p>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li className="text-green-700 dark:text-green-300">
                          ✅ <strong>Step 1 Complete:</strong> Reward allocated on Sepolia testnet
                        </li>
                        <li className="text-blue-700 dark:text-blue-300 font-bold">
                          📍 <strong>Step 2 (You are here):</strong> Click "Claim to Wallet" below
                        </li>
                        <li className="text-muted-foreground">
                          <strong>Step 3:</strong> Confirm the transaction in MetaMask
                        </li>
                        <li className="text-muted-foreground">
                          <strong>Step 4:</strong> Once claimed, proceed to bridge to Solana
                        </li>
                      </ol>
                      {prepareTxHash && (
                        <div className="pt-2 mt-2 border-t">
                          <div className="text-xs text-muted-foreground">
                            Contract prepared: {contractPreparedAt && formatDistanceToNow(new Date(contractPreparedAt))} ago
                          </div>
                          <a 
                            href={`https://sepolia.etherscan.io/tx/${prepareTxHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 mt-1"
                          >
                            View preparation transaction on Etherscan <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* On-chain verification status */}
                {isLoadingClaimable ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying on-chain allocation... (This can take 30-60 seconds)</span>
                  </div>
                ) : !isVerified ? (
                  <Alert className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                    <Info className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="space-y-2">
                      <div className="text-amber-800 dark:text-amber-200 font-semibold">
                        Verification in Progress
                      </div>
                      <div className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                        <p>On-chain claimable: {onChainClaimableAmount ? formatEther(onChainClaimableAmount) : '0'} ETH</p>
                        <p className="mt-2">
                          Blockchain state is settling. You can claim now, or wait 30-60 seconds for full verification.
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
                        Refresh Status
                      </Button>
                    </AlertDescription>
                  </Alert>
                ) : null}

                {/* Error display with helpful messages */}
                {claimError && (
                  <Alert className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="space-y-2">
                      <div className="text-red-800 dark:text-red-200 font-semibold">
                        ⚠️ Transaction Error
                      </div>
                      <div className="text-sm text-red-700 dark:text-red-300">
                        {claimError}
                      </div>
                      {claimError.includes('gas') && (
                        <div className="space-y-2 mt-2">
                          {!useManualGas && (
                            <Button 
                              onClick={() => setUseManualGas(true)}
                              variant="outline"
                              size="sm"
                            >
                              Enable Manual Gas Limit
                            </Button>
                          )}
                          <div className="text-xs text-red-600 dark:text-red-400">
                            💡 Need Sepolia ETH for gas? Get free test ETH from a{' '}
                            <a 
                              href="https://sepoliafaucet.com" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="underline hover:text-red-800"
                            >
                              Sepolia faucet
                            </a>
                          </div>
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Manual gas option */}
                {useManualGas && (
                  <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                    <AlertDescription>
                      <div className="text-sm text-blue-800 dark:text-blue-200">
                        ⚙️ Manual gas limit enabled (100,000 gas). This bypasses automatic estimation.
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
                
                {/* Prominent Claim Button with Tooltip */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative">
                        <Button 
                          onClick={handleClaimFromContract}
                          disabled={isClaimPending || isClaimConfirming}
                          className="w-full text-lg h-14 relative overflow-hidden group"
                          size="lg"
                          variant={isVerified ? "default" : "secondary"}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 group-hover:via-primary/30 transition-all" />
                          {isClaimPending || isClaimConfirming ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              {isClaimPending ? 'Approve in MetaMask...' : 'Confirming Transaction...'}
                            </>
                          ) : (
                            <>
                              <Download className="mr-2 h-5 w-5 animate-bounce" />
                              {isVerified 
                                ? `Claim ${onChainClaimableAmount ? formatEther(onChainClaimableAmount) : ethAmount?.toFixed(6)} ETH to Wallet`
                                : `Try Claim ${ethAmount?.toFixed(6)} ETH Now`
                              }
                            </>
                          )}
                        </Button>
                        {!isClaimPending && !isClaimConfirming && (
                          <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-600 rounded-full animate-ping" />
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This will open MetaMask for you to approve the transaction</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <div className="text-center space-y-2">
                  <p className="text-sm font-medium text-primary">
                    {isVerified 
                      ? '✅ Verified! Click above to transfer ETH to your wallet'
                      : '⏳ Verifying on-chain... You can claim now or wait'
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">
                    This transaction requires a small amount of Sepolia ETH for gas (~$0.50)
                  </p>
                </div>

                {/* Need Help Section */}
                <Collapsible className="border rounded-lg">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <HelpCircle className="h-4 w-4" />
                        Need help claiming?
                      </span>
                      <AlertCircle className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 space-y-2 text-sm">
                    <p className="font-semibold">Troubleshooting Tips:</p>
                    <ul className="space-y-1.5 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Make sure MetaMask is installed and unlocked</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Confirm you're on Sepolia testnet (not Ethereum mainnet)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>You need ~$0.50 in Sepolia ETH for gas fees</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>Click "Claim" and approve the transaction in MetaMask popup</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                        <span>If gas estimation fails, wait 30 seconds and try again</span>
                      </li>
                    </ul>
                    <div className="pt-2 border-t">
                      <a 
                        href="https://sepoliafaucet.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                      >
                        Get free Sepolia ETH from faucet <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DePINClaimInfoCard;
