import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, AlertCircle, ExternalLink, Link as LinkIcon, DollarSign } from 'lucide-react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useEvmWalletLink } from '@/hooks/useEvmWalletLink';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { TEMPO_DEPIN_FAUCET_ADDRESS, TEMPO_DEPIN_FAUCET_ABI } from '@/contracts/TempoDePINFaucet';

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
  
  const { address } = useAccount();
  const { toast } = useToast();
  const { isLinked, isLinking, linkError, linkEvmWallet } = useEvmWalletLink();

  // Wagmi hooks for claiming from smart contract
  const { writeContract, data: claimTxHash, isPending: isClaimPending } = useWriteContract();
  
  const { isLoading: isClaimConfirming, isSuccess: isClaimSuccess } = useWaitForTransactionReceipt({
    hash: claimTxHash,
  });

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
      
      toast({
        title: "Contract Prepared! ✅",
        description: `${parseFloat(data.sepoliaEthAmount).toFixed(6)} ETH is ready to claim. Click "Claim from Contract" to proceed.`,
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

    console.log('[DePINClaimInfoCard] User claiming from contract...');
    
    writeContract({
      address: TEMPO_DEPIN_FAUCET_ADDRESS,
      abi: TEMPO_DEPIN_FAUCET_ABI,
      functionName: 'claimReward',
      chain: sepolia,
      account: address,
    });
  };

  // Handle successful claim
  useEffect(() => {
    if (isClaimSuccess && ethAmount) {
      console.log('[DePINClaimInfoCard] Claim successful, updating database...');
      
      // Update database with user's claim transaction
      supabase
        .from('depin_reward_claims')
        .update({
          user_claim_tx: claimTxHash,
          user_claim_confirmed_at: new Date().toISOString(),
          status: 'claimed'
        })
        .eq('id', claimId)
        .then(({ error }) => {
          if (error) {
            console.error('Failed to update claim:', error);
          }
        });

      toast({
        title: "Claim Complete! 🎉",
        description: `Successfully claimed ${ethAmount.toFixed(6)} ETH from smart contract!`,
      });
      
      onContractPrepared(ethAmount);
    }
  }, [isClaimSuccess, ethAmount, claimTxHash, claimId, onContractPrepared, toast]);

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

            {/* Step 2: User Claims from Contract */}
            {contractPrepared && !isClaimSuccess && (
              <div className="space-y-4">
                <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="space-y-2">
                    <div className="text-blue-800 dark:text-blue-200 font-semibold">
                      Contract Prepared! Ready to Claim
                    </div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      {ethAmount?.toFixed(6)} ETH is ready to claim from the smart contract.
                      You'll need to approve this transaction in your wallet (MetaMask/etc).
                    </div>
                    {prepareTxHash && (
                      <a 
                        href={`https://sepolia.etherscan.io/tx/${prepareTxHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                      >
                        View preparation tx <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </AlertDescription>
                </Alert>
                
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
                      Claim from Contract (Approve in Wallet)
                    </>
                  )}
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  This will trigger a MetaMask popup for you to approve the claim transaction
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
