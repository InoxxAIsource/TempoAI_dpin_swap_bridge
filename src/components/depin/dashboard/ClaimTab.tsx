import { useState, useEffect } from 'react';
import { useWalletContext } from '@/contexts/WalletContext';
import AuthPrompt from '../AuthPrompt';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, ArrowRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import ClaimStatusTracker from '@/components/claim/ClaimStatusTracker';
import WormholeBridgeStatus from '../WormholeBridgeStatus';
import { supabase } from '@/integrations/supabase/client';

interface Claim {
  id: string;
  total_amount: number;
  status: string;
  destination_chain: string;
  claimed_at: string;
  eth_transfer_tx?: string;
}

interface ClaimTabProps {
  pendingRewards: number;
  activeClaims: Claim[];
  onClaimClick: () => void;
}

const ClaimTab = ({ pendingRewards, activeClaims, onClaimClick }: ClaimTabProps) => {
  const { isAuthenticated } = useWalletContext();
  const [wormholeTransactions, setWormholeTransactions] = useState<Record<string, any>>({});

  // Fetch Wormhole transactions for active claims
  useEffect(() => {
    const fetchWormholeStatus = async () => {
      if (!isAuthenticated || activeClaims.length === 0) return;
      
      const claimIds = activeClaims.map(c => c.id);
      
      const { data, error } = await supabase
        .from('wormhole_transactions')
        .select('*')
        .eq('source_type', 'depin_claim')
        .contains('source_reference_ids', claimIds);
      
      if (error) {
        console.error('[ClaimTab] Error fetching Wormhole transactions:', error);
        return;
      }

      if (data) {
        const mapped = data.reduce((acc: Record<string, any>, tx: any) => {
          const claimId = tx.source_reference_ids?.[0];
          if (claimId) acc[claimId] = tx;
          return acc;
        }, {});
        setWormholeTransactions(mapped);
      }
    };
    
    fetchWormholeStatus();
  }, [activeClaims, isAuthenticated]);

  if (!isAuthenticated) {
    return <AuthPrompt />;
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: any; icon: any; label: string }> = {
      pending: { variant: 'outline', icon: Clock, label: 'Pending' },
      contract_prepared: { variant: 'secondary', icon: Clock, label: 'Prepared' },
      ready_to_claim: { variant: 'default', icon: Coins, label: 'Ready' },
      claimed: { variant: 'default', icon: CheckCircle, label: 'Claimed' },
      failed: { variant: 'destructive', icon: AlertCircle, label: 'Failed' },
    };

    const config = statusMap[status] || statusMap.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Rewards & Claims</h2>
        <p className="text-muted-foreground">
          Claim your earned rewards and track claim history
        </p>
      </div>

      {/* Pending Rewards Summary */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-6 h-6 text-primary" />
            Available to Claim
          </CardTitle>
          <CardDescription>Your total pending rewards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-4xl font-bold text-primary">
            ${pendingRewards.toFixed(2)}
          </div>
          <Button onClick={onClaimClick} size="lg" className="w-full" disabled={pendingRewards === 0}>
            Claim Rewards
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>

      {/* Active Claims */}
      {activeClaims.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Active Claims</h3>
          {activeClaims.map((claim) => (
            <Card key={claim.id} className="border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      ${claim.total_amount.toFixed(2)}
                    </CardTitle>
                    <CardDescription>
                      Destination: {claim.destination_chain}
                    </CardDescription>
                  </div>
                  {getStatusBadge(claim.status)}
                </div>
              </CardHeader>
              <CardContent>
                <ClaimStatusTracker
                  status={claim.status}
                  txHash={claim.eth_transfer_tx}
                  fromChain="Sepolia"
                  toChain={claim.destination_chain}
                />
                
                {/* Show Wormhole bridge status if exists */}
                {wormholeTransactions[claim.id] && (
                  <div className="mt-4 p-3 border rounded-lg bg-secondary/20">
                    <h4 className="font-semibold text-sm mb-2">Wormhole Bridge Status</h4>
                    <WormholeBridgeStatus transaction={wormholeTransactions[claim.id]} />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Claim History Info */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Claim History</CardTitle>
          <CardDescription>
            View your complete claim history in the Claim page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild>
            <a href="/claim">View Full History</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClaimTab;
