import { useEffect, useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHero from '../components/layout/PageHero';
import PortfolioOverview from '../components/portfolio/PortfolioOverview';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ClaimStatusTracker from '@/components/claim/ClaimStatusTracker';
import DePINClaimInfoCard from '@/components/depin/DePINClaimInfoCard';
import { DebugPanel } from '@/components/portfolio/DebugPanel';
import { ArrowLeft, ExternalLink, CheckCircle2, Activity, AlertCircle, Circle, ArrowRight } from 'lucide-react';

interface PendingClaim {
  id: string;
  total_amount: number;
  destination_chain: string;
  status: string;
  device_ids: string[];
  wormhole_tx_id: string | null;
  claimed_at: string;
  sepolia_eth_amount: number | null;
  contract_prepared_at: string | null;
  wormhole_tx?: {
    from_chain: string;
    to_chain: string;
    status: string;
    tx_hash: string | null;
    wormhole_vaa: string | null;
    needs_redemption: boolean;
    contract_claim_status: string | null;
    contract_claim_tx: string | null;
  };
}

const Portfolio = () => {
  const [user, setUser] = useState<any>(null);
  const [pendingClaims, setPendingClaims] = useState<PendingClaim[]>([]);
  const [deviceCount, setDeviceCount] = useState(0);
  const [lastFetchTime, setLastFetchTime] = useState<number>(Date.now());
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }
      console.log(`[Portfolio] User logged in: ${user.id.substring(0, 8)}...`);
      setUser(user);
      await fetchDeviceCount(user.id);
      await fetchPendingClaims(user.id);
      setLastFetchTime(Date.now());
    };

    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`[Portfolio] Auth state changed:`, event);
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setPendingClaims([]);
        setDeviceCount(0);
        navigate('/auth');
      } else if (event === 'SIGNED_IN' && session?.user) {
        console.log(`[Portfolio] New user signed in: ${session.user.id.substring(0, 8)}...`);
        setUser(session.user);
        await fetchDeviceCount(session.user.id);
        await fetchPendingClaims(session.user.id);
        setLastFetchTime(Date.now());
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const fetchDeviceCount = async (userId: string) => {
    console.log(`[Portfolio] Fetching device count for user: ${userId.substring(0, 8)}...`);
    const { count, error } = await supabase
      .from('device_registry')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'active');
    
    if (error) {
      console.error(`[Portfolio] Error fetching device count:`, error);
    } else {
      console.log(`[Portfolio] Device count: ${count}`);
      setDeviceCount(count || 0);
    }
  };

  const fetchPendingClaims = async (userId: string) => {
    console.log(`[Portfolio] Fetching pending claims for user: ${userId.substring(0, 8)}...`);
    const { data, error } = await supabase
      .from('depin_reward_claims')
      .select(`
        *,
        wormhole_tx:wormhole_transactions(*)
      `)
      .eq('user_id', userId)
      .in('status', ['pending_approval', 'claiming'])
      .order('claimed_at', { ascending: false });

    if (error) {
      console.error(`[Portfolio] Error fetching claims:`, error);
    } else {
      console.log(`[Portfolio] Pending claims: ${data?.length || 0}`);
      setPendingClaims(data as any || []);
    }
  };

  const handleClearCache = () => {
    console.log(`[Portfolio] Clearing cache...`);
    setPendingClaims([]);
    setDeviceCount(0);
    if (user) {
      fetchDeviceCount(user.id);
      fetchPendingClaims(user.id);
    }
    setLastFetchTime(Date.now());
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
          {/* Debug Panel */}
          <DebugPanel
            userId={user?.id || null}
            deviceCount={deviceCount}
            dataAge={Date.now() - lastFetchTime}
            onClearCache={handleClearCache}
          />
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

          {/* Active Devices Card */}
          <Card className="mb-8">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Devices</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deviceCount}</div>
              <p className="text-xs text-muted-foreground">
                {deviceCount === 0 ? 'No devices connected' : 'Connected to network'}
              </p>
            </CardContent>
          </Card>

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
                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      {!claim.contract_prepared_at && (
                        <Badge variant="outline" className="gap-1">
                          <Circle className="w-3 h-3 fill-current" />
                          Step 1: Prepare Contract
                        </Badge>
                      )}
                      {claim.contract_prepared_at && !claim.wormhole_tx && (
                        <Badge variant="default" className="gap-1 animate-pulse">
                          <AlertCircle className="w-3 h-3" />
                          Step 2: Claim ETH (Action Required)
                        </Badge>
                      )}
                      {claim.wormhole_tx && (
                        <Badge variant="default" className="gap-1 animate-pulse">
                          <ArrowRight className="w-3 h-3" />
                          Step 3: Bridge to Solana
                        </Badge>
                      )}
                    </div>

                    {/* DePINClaimInfoCard - Keep visible until bridge is initiated */}
                    {!claim.wormhole_tx && (
                      <DePINClaimInfoCard
                        claimId={claim.id}
                        sepoliaEthAmount={claim.sepolia_eth_amount}
                        contractPreparedAt={claim.contract_prepared_at}
                        onEthClaimedToWallet={() => fetchPendingClaims(user.id)}
                      />
                    )}

                    {/* Wormhole Transaction Status */}
                    {claim.wormhole_tx && (
                      <ClaimStatusTracker
                        status={claim.wormhole_tx.status}
                        txHash={claim.wormhole_tx.tx_hash}
                        vaa={claim.wormhole_tx.wormhole_vaa}
                        fromChain={claim.wormhole_tx.from_chain}
                        toChain={claim.wormhole_tx.to_chain}
                      />
                    )}
                    
                    {/* Redemption Button */}
                    {claim.wormhole_tx?.needs_redemption && (
                      <Button
                        onClick={() => navigate('/claim')}
                        className="w-full gap-2"
                      >
                        Claim on Destination Chain
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
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
