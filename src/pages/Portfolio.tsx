import { useEffect, useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHero from '../components/layout/PageHero';
import PortfolioOverview from '../components/portfolio/PortfolioOverview';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ClaimStatusTracker from '@/components/claim/ClaimStatusTracker';
import { ArrowLeft, ExternalLink } from 'lucide-react';

interface PendingClaim {
  id: string;
  total_amount: number;
  destination_chain: string;
  status: string;
  device_ids: string[];
  wormhole_tx_id: string | null;
  claimed_at: string;
  wormhole_tx?: {
    from_chain: string;
    to_chain: string;
    status: string;
    tx_hash: string | null;
    wormhole_vaa: string | null;
    needs_redemption: boolean;
  };
}

const Portfolio = () => {
  const [user, setUser] = useState<any>(null);
  const [pendingClaims, setPendingClaims] = useState<PendingClaim[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (!user) {
        navigate('/auth');
      } else {
        fetchPendingClaims(user.id);
      }
    });
  }, [navigate]);

  const fetchPendingClaims = async (userId: string) => {
    const { data, error } = await supabase
      .from('depin_reward_claims')
      .select(`
        *,
        wormhole_tx:wormhole_transactions(*)
      `)
      .eq('user_id', userId)
      .in('status', ['pending_approval', 'claiming'])
      .order('claimed_at', { ascending: false });

    if (!error && data) {
      setPendingClaims(data as any);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <PageLayout>
      <PageHero 
        title="Portfolio Overview"
        description="Track your DePIN earnings and cross-chain assets in real-time"
      />

      <section className="px-4 md:px-6 lg:px-12 py-6 md:py-8 pb-16 md:pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/depin')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to DePIN
            </Button>
          </div>

          {/* Pending Claims Section */}
          {pendingClaims.length > 0 && (
            <div className="mb-8 space-y-4">
              <h2 className="text-2xl font-bold">Pending Claims</h2>
              {pendingClaims.map((claim) => (
                <Card key={claim.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>${claim.total_amount.toFixed(2)} USDC</span>
                      <span className="text-sm font-normal text-muted-foreground">
                        {claim.device_ids.length} device{claim.device_ids.length !== 1 ? 's' : ''}
                      </span>
                    </CardTitle>
                    <CardDescription>
                      Claiming to {claim.destination_chain}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {claim.wormhole_tx && (
                      <ClaimStatusTracker
                        status={claim.wormhole_tx.status}
                        txHash={claim.wormhole_tx.tx_hash}
                        vaa={claim.wormhole_tx.wormhole_vaa}
                        fromChain={claim.wormhole_tx.from_chain}
                        toChain={claim.wormhole_tx.to_chain}
                      />
                    )}
                    <div className="flex gap-2">
                      {claim.status === 'pending_approval' && (
                        <Button
                          onClick={() => navigate(`/bridge?claimId=${claim.id}`)}
                          className="gap-2"
                        >
                          Complete Bridge
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                      {claim.wormhole_tx?.needs_redemption && (
                        <Button
                          onClick={() => navigate('/claim')}
                          className="gap-2"
                        >
                          Claim on Destination
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <PortfolioOverview userId={user.id} />
        </div>
      </section>
    </PageLayout>
  );
};

export default Portfolio;
