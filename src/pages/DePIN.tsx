import { useEffect, useState, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Gift, Wallet, Plus, Book } from 'lucide-react';
import { toast } from 'sonner';
import PageLayout from '@/components/layout/PageLayout';
import PageHero from '@/components/layout/PageHero';
import { Skeleton } from '@/components/ui/skeleton';
import OnboardingModal from '@/components/depin/OnboardingModal';

const Globe3D = lazy(() => import('@/components/depin/Globe3D'));
import SetupGuideModal from '@/components/depin/SetupGuideModal';
import BatchClaimModal from '@/components/depin/BatchClaimModal';
import ClaimTab from '@/components/depin/dashboard/ClaimTab';
import PortfolioTab from '@/components/depin/dashboard/PortfolioTab';
import AddDeviceTab from '@/components/depin/dashboard/AddDeviceTab';
import DocsTab from '@/components/depin/dashboard/DocsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useWalletContext } from '@/contexts/WalletContext';

interface Device {
  id: string;
  device_id: string;
  device_name: string;
  device_type: string;
  status: string;
  is_verified: boolean;
  metadata: any;
  last_seen_at: string;
  user_id: string;
}

const DePIN = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'portfolio';
  const { isAuthenticated, session } = useWalletContext();

  const [devices, setDevices] = useState<Device[]>([]);
  const [earnings, setEarnings] = useState(0);
  const [activeDevices, setActiveDevices] = useState(0);
  const [uptime, setUptime] = useState(0);
  const [dailyRate, setDailyRate] = useState(0);
  const [activeClaims, setActiveClaims] = useState<any[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [showBatchClaim, setShowBatchClaim] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkFirstVisit();
  }, []);

  const checkFirstVisit = async () => {
    const hasVisited = localStorage.getItem('depin-visited');
    if (!hasVisited) {
      setShowOnboarding(true);
      localStorage.setItem('depin-visited', 'true');
    }
  };

  const fetchDevices = async () => {
    if (!session?.user?.id) return;

    const { data, error } = await supabase
      .from('device_registry')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching devices:', error);
      return;
    }

    setDevices(data || []);
    const active = data?.filter((d) => d.status === 'active').length || 0;
    setActiveDevices(active);

    if (data && data.length > 0) {
      const now = new Date().getTime();
      const onlineDevices = data.filter(
        (d) => d.last_seen_at && now - new Date(d.last_seen_at).getTime() < 5 * 60 * 1000
      );
      const avgUp = onlineDevices.length > 0 ? (onlineDevices.length / data.length) * 100 : 0;
      setUptime(avgUp);
    }
  };

  const fetchEarnings = async () => {
    if (!session?.user?.id) return;

    const { data, error } = await supabase
      .from('depin_rewards')
      .select('amount, created_at')
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error fetching earnings:', error);
      return;
    }

    const total = data?.reduce((acc, reward) => acc + reward.amount, 0) || 0;
    setEarnings(total);

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const recentRewards = data?.filter((r) => r.created_at >= oneDayAgo) || [];
    const dailyTotal = recentRewards.reduce((acc, r) => acc + r.amount, 0);
    setDailyRate(dailyTotal);
  };

  const fetchActiveClaims = async () => {
    if (!session?.user?.id) return;

    const { data, error } = await supabase
      .from('depin_reward_claims')
      .select('*')
      .eq('user_id', session.user.id)
      .in('status', ['pending', 'contract_prepared', 'ready_to_claim']);

    if (!error && data) {
      setActiveClaims(data);
    }
  };

  const handleDeviceAdded = () => {
    fetchDevices();
    toast.success('Device added successfully!');
  };

  const handleDeleteDevice = async (deviceId: string) => {
    const { error } = await supabase
      .from('device_registry')
      .delete()
      .eq('id', deviceId);

    if (error) {
      toast.error('Failed to delete device');
      return;
    }

    toast.success('Device deleted');
    fetchDevices();
  };

  const startSimulation = async () => {
    if (!session?.user?.id) return;

    try {
      await supabase.functions.invoke('simulate-device-events', {
        body: { userId: session.user.id },
      });
    } catch (error) {
      console.error('Simulation error:', error);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchDevices();
      fetchEarnings();
      fetchActiveClaims();
      setUserId(session.user.id);
    }

    const devicesChannel = supabase
      .channel('depin-devices-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'device_registry' },
        () => fetchDevices()
      )
      .subscribe();

    const rewardsChannel = supabase
      .channel('depin-rewards-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'depin_rewards' },
        () => fetchEarnings()
      )
      .subscribe();

    const claimsChannel = supabase
      .channel('depin-claims-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'depin_reward_claims' },
        () => fetchActiveClaims()
      )
      .subscribe();

    return () => {
      devicesChannel.unsubscribe();
      rewardsChannel.unsubscribe();
      claimsChannel.unsubscribe();
    };
  }, [session?.user?.id]);

  useEffect(() => {
    if (session?.user?.id) {
      startSimulation();
    }
  }, [session?.user?.id]);

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  const deviceBreakdown = devices.map((device) => ({
    deviceId: device.device_id,
    deviceName: device.device_name,
    amount: 0,
  }));

  return (
    <PageLayout>
      <PageHero
        title="DePIN Dashboard"
        description="Manage your devices and earn rewards"
      />

      {showOnboarding && (
        <OnboardingModal
          open={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          onStartDemo={() => {}}
          onConnectReal={() => setShowOnboarding(false)}
          isAuthenticated={isAuthenticated}
          authMethod={isAuthenticated ? 'wallet' : null}
          onShowWalletModal={() => {}}
          onNavigateToAuth={() => {}}
        />
      )}

      {showSetupGuide && (
        <SetupGuideModal
          open={showSetupGuide}
          onClose={() => setShowSetupGuide(false)}
          deviceId="demo-device"
        />
      )}

      {showBatchClaim && (
        <BatchClaimModal
          open={showBatchClaim}
          onClose={() => setShowBatchClaim(false)}
          deviceBreakdown={deviceBreakdown}
          totalAmount={earnings}
          requestedAmount={null}
          preferredChain="Solana"
          onSuccess={() => {
            fetchEarnings();
            fetchActiveClaims();
          }}
        />
      )}

      <div className="px-4 md:px-6 lg:px-12 pb-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* 3D Globe Hero - Always Visible */}
          <div className="relative">
            <Suspense fallback={
              <div className="w-full h-[500px] md:h-[600px] lg:h-[700px] bg-secondary/20 rounded-lg flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Skeleton className="h-32 w-32 rounded-full mx-auto" />
                  <p className="text-muted-foreground">Loading 3D Globe...</p>
                </div>
              </div>
            }>
              <Globe3D
                devices={devices}
                onDeviceClick={(deviceId) => {
                  console.log('Device clicked:', deviceId);
                }}
                autoRotate={true}
              />
            </Suspense>

            {/* Stats Overlay */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-3xl px-4">
              <Card className="bg-background/95 backdrop-blur-sm border-2 border-primary/20 shadow-xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Total Devices</p>
                    <p className="text-2xl font-bold">{devices.length}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Active</p>
                    <p className="text-2xl font-bold text-green-500">{activeDevices}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Total Earned</p>
                    <p className="text-2xl font-bold">{earnings.toFixed(4)} ETH</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Uptime</p>
                    <p className="text-2xl font-bold">{uptime}%</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Horizontal Tabs */}
          <Tabs value={currentTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="claim" className="relative">
                <Gift className="w-4 h-4 mr-2" />
                Claim
                {activeClaims.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {activeClaims.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="portfolio">
                <Wallet className="w-4 h-4 mr-2" />
                Portfolio
              </TabsTrigger>
              <TabsTrigger value="add-device">
                <Plus className="w-4 h-4 mr-2" />
                Add Device
              </TabsTrigger>
              <TabsTrigger value="docs">
                <Book className="w-4 h-4 mr-2" />
                DePIN Docs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="claim" className="mt-6">
              <ClaimTab
                pendingRewards={earnings}
                activeClaims={activeClaims}
                onClaimClick={() => setShowBatchClaim(true)}
              />
            </TabsContent>

            <TabsContent value="portfolio" className="mt-6">
              <PortfolioTab
                earnings={earnings}
                dailyRate={dailyRate}
                activeDevices={activeDevices}
                uptime={uptime}
              />
            </TabsContent>

            <TabsContent value="add-device" className="mt-6">
              <AddDeviceTab
                onDeviceAdded={handleDeviceAdded}
                onOpenSetupGuide={() => setShowSetupGuide(true)}
              />
            </TabsContent>

            <TabsContent value="docs" className="mt-6">
              <DocsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
};

export default DePIN;
