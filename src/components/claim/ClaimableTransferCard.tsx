import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ChainBadge from '@/components/ui/ChainBadge';
import { ExternalLink, RefreshCw, ArrowRight, Wallet, AlertTriangle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { checkWormholeTxStatus } from '@/utils/wormholeScanAPI';

interface ClaimableTransferCardProps {
  transfer: {
    id: string;
    from_chain: string;
    to_chain: string;
    from_token: string;
    to_token: string;
    amount: number;
    status: string;
    tx_hash: string | null;
    needs_redemption: boolean;
    wormhole_vaa: string | null;
    wallet_address: string;
    created_at?: string;
  };
  currentWallet?: string;
  onRefresh: () => void;
}

const ClaimableTransferCard = ({ transfer, currentWallet, onRefresh }: ClaimableTransferCardProps) => {
  const [checking, setChecking] = useState(false);
  const { toast } = useToast();
  
  const walletMatches = currentWallet && transfer.wallet_address && 
    currentWallet.toLowerCase() === transfer.wallet_address.toLowerCase();
  
  const formatWallet = (address: string) => {
    if (!address) return 'Unknown';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getMinutesElapsed = () => {
    if (!transfer.created_at) return 0;
    const created = new Date(transfer.created_at);
    const now = new Date();
    return Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
  };

  const getNetworkMode = (chainName: string): 'Testnet' | 'Mainnet' => {
    const testnetChains = [
      'sepolia', 'goerli', 'holesky',
      'arbitrum sepolia', 'base sepolia', 'optimism sepolia',
      'polygon amoy', 'mumbai',
      'bsc testnet', 'fuji', 'fantom testnet',
      'solana devnet', 'solana testnet',
      'sui testnet', 'aptos testnet'
    ];
    
    return testnetChains.some(tc => chainName.toLowerCase().includes(tc)) 
      ? 'Testnet' 
      : 'Mainnet';
  };

  const handleCheckStatus = async () => {
    if (!transfer.tx_hash) {
      toast({
        title: "Missing Transaction Hash",
        description: "Cannot check status without a transaction hash",
        variant: "destructive"
      });
      return;
    }

    setChecking(true);
    try {
      const minutesElapsed = getMinutesElapsed();
      if (minutesElapsed < 12) {
        toast({
          title: "⏳ Too Soon to Check",
          description: `Please wait ${12 - minutesElapsed} more minutes. Blockchain finality takes 15-20 minutes on testnet.`,
          variant: "default"
        });
        setChecking(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('check-transfer-status', {
        body: { tx_hash: transfer.tx_hash }
      });

      if (error) throw error;

      toast({
        title: data.ready_to_claim ? "✅ Ready to Claim!" : "⏳ Still Processing",
        description: data.ready_to_claim 
          ? "Your transfer is ready to claim on the destination chain"
          : `Guardian verification in progress. Estimated completion: ${Math.max(35 - minutesElapsed, 0)} minutes.`
      });

      onRefresh();
    } catch (error) {
      console.error('Error checking status:', error);
      
      const minutesElapsed = getMinutesElapsed();
      toast({
        title: "Status Check Issue",
        description: minutesElapsed < 15 
          ? "Transaction is still waiting for blockchain finality. Please try again in a few minutes."
          : "Unable to fetch status. This may be due to testnet delays. Transaction will auto-update when ready.",
        variant: "default"
      });
    } finally {
      setChecking(false);
    }
  };

  const handleFetchVAA = async () => {
    if (!transfer.tx_hash) return;
    
    setChecking(true);
    try {
      const status = await checkWormholeTxStatus(transfer.tx_hash, 'Testnet');
      
      if (status.vaa) {
        const { error } = await supabase
          .from('wormhole_transactions')
          .update({
            wormhole_vaa: status.vaa,
            needs_redemption: status.needsRedemption,
          })
          .eq('id', transfer.id);

        if (error) throw error;

        toast({
          title: "✅ VAA Retrieved",
          description: status.needsRedemption 
            ? "Transfer is ready to claim!" 
            : "VAA fetched. Guardian verification complete.",
        });
        onRefresh();
      } else {
        toast({
          title: "⏳ VAA Not Ready",
          description: "Guardian verification still in progress. This usually takes 15-30 minutes.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error fetching VAA:', error);
      toast({
        title: "Error",
        description: "Failed to fetch VAA. Please try again.",
        variant: "destructive"
      });
    } finally {
      setChecking(false);
    }
  };

  const handleClaimOnWormhole = () => {
    if (!transfer.tx_hash) return;
    
    const network = getNetworkMode(transfer.from_chain);
    const url = `https://wormholescan.io/#/tx/${transfer.tx_hash}?network=${network}`;
    window.open(url, '_blank');
    
    toast({
      title: "Opening WormholeScan",
      description: "Complete your claim on the WormholeScan interface"
    });
  };

  const getStatusBadge = () => {
    if (transfer.needs_redemption) {
      return <Badge className="bg-green-500 hover:bg-green-600">Ready to Claim</Badge>;
    }
    if (transfer.status === 'pending') {
      return <Badge variant="outline">Processing</Badge>;
    }
    return <Badge variant="secondary">{transfer.status}</Badge>;
  };

  return (
    <Card className="p-6 border-l-4 border-l-primary hover:shadow-lg transition-all">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-4">
            <ChainBadge chain={transfer.from_chain} />
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
            <ChainBadge chain={transfer.to_chain} />
          </div>
          
          <div>
            <div className="text-2xl font-bold">
              {transfer.amount} {transfer.from_token}
            </div>
            <div className="text-sm text-muted-foreground">
              To receive: {transfer.to_token} on {transfer.to_chain}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            {getStatusBadge()}
          </div>
          
          {transfer.wallet_address && (
            <div className="flex items-center gap-2 text-sm">
              <Wallet className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Wallet:</span>
              <code className="px-2 py-1 bg-secondary rounded text-xs">
                {formatWallet(transfer.wallet_address)}
              </code>
              {currentWallet && walletMatches && (
                <Badge variant="outline" className="text-green-500 border-green-500">
                  Connected
                </Badge>
              )}
              {currentWallet && !walletMatches && (
                <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Different Wallet
                </Badge>
              )}
            </div>
          )}
          
          {transfer.tx_hash && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Transaction:</span>
              <code className="px-2 py-1 bg-secondary rounded text-xs">
                {transfer.tx_hash.slice(0, 8)}...{transfer.tx_hash.slice(-6)}
              </code>
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-3 md:w-64">
          {transfer.status === 'pending' && !transfer.wormhole_vaa && (
            <div className="p-3 bg-blue-500/10 border border-blue-500/50 rounded-lg">
              <div className="text-sm">
                {getMinutesElapsed() < 15 ? (
                  <>
                    <p className="font-semibold text-blue-500 mb-1 flex items-center gap-1">
                      <Clock className="w-4 h-4" /> Waiting for Finality
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Your transaction needs {15 - getMinutesElapsed()} more minutes to reach blockchain finality.
                      Guardian verification will begin after finality is reached (typically 15-20 minutes).
                    </p>
                  </>
                ) : getMinutesElapsed() < 35 ? (
                  <>
                    <p className="font-semibold text-blue-500 mb-1">🔐 Guardian Verification</p>
                    <p className="text-muted-foreground text-xs">
                      Blockchain finality reached! Wormhole Guardians are now signing your VAA.
                      This typically takes 5-15 minutes. You can manually check using the buttons below.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-yellow-500 mb-1">⚠️ Taking Longer Than Expected</p>
                    <p className="text-muted-foreground text-xs">
                      Your transaction has been pending for {getMinutesElapsed()} minutes.
                      This may be due to testnet congestion. Try the "Fetch VAA" button below.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {currentWallet && !walletMatches && transfer.wallet_address && (
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
              <p className="text-xs text-yellow-500 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Connect wallet {formatWallet(transfer.wallet_address)} to claim this transfer</span>
              </p>
            </div>
          )}
          
          {!transfer.wormhole_vaa && transfer.status === 'pending' && (
            <Button
              onClick={handleFetchVAA}
              disabled={checking}
              variant="outline"
              className="w-full"
            >
              {checking ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Fetching VAA...
                </>
              ) : (
                'Fetch VAA'
              )}
            </Button>
          )}
          
          <Button
            onClick={handleCheckStatus}
            disabled={checking}
            variant="outline"
            className="w-full"
          >
            {checking ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Check Status
              </>
            )}
          </Button>
          
          {transfer.tx_hash && (
            <Button
              onClick={() => {
                const network = getNetworkMode(transfer.from_chain);
                const url = `https://wormholescan.io/#/tx/${transfer.tx_hash}?network=${network}`;
                window.open(url, '_blank');
              }}
              variant="outline"
              className="w-full"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on WormholeScan
            </Button>
          )}
          
          {transfer.needs_redemption && (
            <Button
              onClick={handleClaimOnWormhole}
              disabled={!transfer.tx_hash}
              className="w-full"
            >
              Claim on WormholeScan
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ClaimableTransferCard;
