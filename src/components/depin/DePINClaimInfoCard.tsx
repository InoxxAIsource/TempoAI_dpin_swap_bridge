import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, AlertCircle, ExternalLink, Link as LinkIcon, DollarSign } from 'lucide-react';
import { useAccount } from 'wagmi';
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
  const [transferring, setTransferring] = useState(false);
  const [transferData, setTransferData] = useState<{
    txHash: string;
    ethAmount: string;
    usdcAmount: number;
    ethPrice: number;
    explorerUrl: string;
  } | null>(null);
  
  const { address } = useAccount();
  const { toast } = useToast();
  const { isLinked, isLinking, linkError, linkEvmWallet } = useEvmWalletLink();

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

  // Transfer reward to user's wallet
  const handleTransferReward = async () => {
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

    setTransferring(true);
    try {
      console.log('Initiating reward transfer...');
      const { data, error } = await supabase.functions.invoke('transfer-reward-eth', {
        body: { 
          claimId,
          evmWalletAddress: address 
        },
      });

      if (error) throw error;

      console.log('Transfer successful:', data);
      setTransferData({
        txHash: data.txHash,
        ethAmount: data.sepoliaEthAmount,
        usdcAmount: data.usdcAmount,
        ethPrice: data.ethPriceUSD,
        explorerUrl: data.explorerUrl,
      });

      toast({
        title: "Transfer Complete! 🎉",
        description: `${parseFloat(data.sepoliaEthAmount).toFixed(6)} ETH sent to your wallet`,
      });

      // Wait a bit before calling onContractPrepared to let the UI update
      setTimeout(() => {
        onContractPrepared();
      }, 1000);
    } catch (error) {
      console.error('Error transferring reward:', error);
      toast({
        title: "Transfer Failed",
        description: error instanceof Error ? error.message : "Failed to transfer reward",
        variant: "destructive",
      });
    } finally {
      setTransferring(false);
    }
  };

  if (contractPreparedAt || transferData) {
    return (
      <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertDescription className="space-y-2">
          <div className="text-green-800 dark:text-green-200 font-semibold">
            ✓ Reward Transferred Successfully!
          </div>
          {transferData && (
            <>
              <div className="text-sm text-green-700 dark:text-green-300">
                {parseFloat(transferData.ethAmount).toFixed(6)} ETH sent to your Sepolia wallet
              </div>
              <a 
                href={transferData.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
              >
                View on Etherscan <ExternalLink className="h-3 w-3" />
              </a>
            </>
          )}
          <div className="text-sm text-green-700 dark:text-green-300 mt-2">
            You can now proceed to bridge your funds to Solana.
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

            <Button 
              onClick={handleTransferReward}
              disabled={transferring}
              className="w-full"
              size="lg"
            >
              {transferring ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Transferring Reward...
                </>
              ) : (
                <>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Transfer Reward to Sepolia
                </>
              )}
            </Button>

            <div className="text-xs text-muted-foreground text-center space-y-1">
              <p>Your USDC rewards will be converted to ETH at current market price</p>
              <p>A 2% buffer is added to account for price fluctuations</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DePINClaimInfoCard;
