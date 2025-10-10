import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ChainBadge from '@/components/ui/ChainBadge';
import { ExternalLink, RefreshCw, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  };
  onRefresh: () => void;
}

const ClaimableTransferCard = ({ transfer, onRefresh }: ClaimableTransferCardProps) => {
  const [checking, setChecking] = useState(false);
  const { toast } = useToast();

  const handleCheckStatus = async () => {
    setChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-transfer-status', {
        body: { tx_hash: transfer.tx_hash }
      });

      if (error) throw error;

      toast({
        title: data.ready_to_claim ? "Ready to Claim!" : "Still Processing",
        description: data.ready_to_claim 
          ? "Your transfer is ready to claim on the destination chain"
          : "Your transfer is still being processed. Please check again in a few minutes."
      });

      onRefresh();
    } catch (error) {
      console.error('Error checking status:', error);
      toast({
        title: "Error",
        description: "Failed to check transfer status",
        variant: "destructive"
      });
    } finally {
      setChecking(false);
    }
  };

  const handleClaimOnWormhole = () => {
    if (!transfer.tx_hash) return;
    
    const network = transfer.from_chain.toLowerCase().includes('testnet') || 
                    transfer.from_chain.toLowerCase().includes('devnet') 
      ? 'Testnet' 
      : 'Mainnet';
    
    const url = `https://wormholescan.io/#/tx/${transfer.tx_hash}?network=${network}&view=redeem`;
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
          
          <Button
            onClick={handleClaimOnWormhole}
            disabled={!transfer.tx_hash}
            className="w-full"
          >
            Claim on WormholeScan
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ClaimableTransferCard;
