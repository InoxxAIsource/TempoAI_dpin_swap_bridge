import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PageLayout from '@/components/layout/PageLayout';
import PageHero from '@/components/layout/PageHero';
import Globe2DPlaceholder from '@/components/depin/Globe2DPlaceholder';
import OnboardingModal from '@/components/depin/OnboardingModal';
import SetupGuideModal from '@/components/depin/SetupGuideModal';
import BatchClaimModal from '@/components/depin/BatchClaimModal';
import ClaimAmountModal from '@/components/depin/ClaimAmountModal';
import ClaimTab from '@/components/depin/dashboard/ClaimTab';
import { useWormholeVAAPoller } from '@/hooks/useWormholeVAAPoller';
import PortfolioTab from '@/components/depin/dashboard/PortfolioTab';
import AddDeviceTab from '@/components/depin/dashboard/AddDeviceTab';
import DocsTab from '@/components/depin/dashboard/DocsTab';
import MyDevicesTab from '@/components/depin/dashboard/MyDevicesTab';
import DePINSidebar from '@/components/depin/DePINSidebar';
import DeviceDetailsModal from '@/components/depin/DeviceDetailsModal';
import { Card } from '@/components/ui/card';
import { useWalletContext } from '@/contexts/WalletContext';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

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
  const currentTab = searchParams.get('tab') || 'my-devices';
  const { isAuthenticated, session, evmAddress, solanaAddress, walletAuthenticatedAddress } = useWalletContext();

  const [devices, setDevices] = useState<Device[]>([]);
  const [earnings, setEarnings] = useState(0);
  const [activeDevices, setActiveDevices] = useState(0);
  const [uptime, setUptime] = useState(0);
  const [dailyRate, setDailyRate] = useState(0);
  const [activeClaims, setActiveClaims] = useState<any[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [showBatchClaim, setShowBatchClaim] = useState(false);
  const [showClaimAmountModal, setShowClaimAmountModal] = useState(false);
  const [requestedClaimAmount, setRequestedClaimAmount] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [showDeviceDetails, setShowDeviceDetails] = useState(false);
  const [preferredChain, setPreferredChain] = useState('Solana');

  // Add VAA polling for DePIN claim transactions
  useWormholeVAAPoller(evmAddress);

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

  const handleDeviceClick = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    setShowDeviceDetails(true);
  };

  const handleClaimClick = () => {
    setShowClaimAmountModal(true);
  };

  const handleClaimAmountConfirmed = (amount: number) => {
    setRequestedClaimAmount(amount);
    setShowClaimAmountModal(false);
    setShowBatchClaim(true);
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

      {showClaimAmountModal && (
        <ClaimAmountModal
          open={showClaimAmountModal}
          onClose={() => {
            setShowClaimAmountModal(false);
            setRequestedClaimAmount(null);
          }}
          totalAvailable={earnings}
          preferredChain={preferredChain}
          onAmountConfirmed={handleClaimAmountConfirmed}
        />
      )}

      {showBatchClaim && (
        <BatchClaimModal
          open={showBatchClaim}
          onClose={() => {
            setShowBatchClaim(false);
            setRequestedClaimAmount(null);
          }}
          deviceBreakdown={deviceBreakdown}
          totalAmount={earnings}
          requestedAmount={requestedClaimAmount}
          preferredChain={preferredChain}
          onSuccess={() => {
            setShowBatchClaim(false);
            setRequestedClaimAmount(null);
            fetchEarnings();
            fetchActiveClaims();
          }}
        />
      )}

      {showDeviceDetails && (
        <DeviceDetailsModal
          deviceId={selectedDeviceId}
          open={showDeviceDetails}
          onClose={() => setShowDeviceDetails(false)}
        />
      )}

      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen flex w-full">
          <DePINSidebar 
            activeClaimsCount={activeClaims.length}
            deviceCount={devices.length}
          />
          
          <SidebarInset className="flex-1">
            {/* Sidebar Trigger for mobile/collapsed state */}
            <div className="flex items-center gap-2 p-4 border-b">
              <SidebarTrigger />
              <h2 className="text-lg font-semibold">DePIN Dashboard</h2>
            </div>

            <div className="p-4 md:p-6 lg:p-8 space-y-8">
              {/* Globe Visualization */}
              <div className="space-y-4">
                <Globe2DPlaceholder
                  devices={devices}
                  onDeviceClick={handleDeviceClick}
                  autoRotate={true}
                />

                {/* Stats Card - Now separate from globe */}
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

              {/* Tab Content Based on Current Tab */}
              {currentTab === 'my-devices' && (
                <MyDevicesTab
                  devices={devices}
                  onDeleteDevice={handleDeleteDevice}
                  onDeviceClick={handleDeviceClick}
                />
              )}

              {currentTab === 'claim' && (
                <ClaimTab
                  pendingRewards={earnings}
                  activeClaims={activeClaims}
                  onClaimClick={handleClaimClick}
                />
              )}

              {currentTab === 'portfolio' && (
                <PortfolioTab
                  earnings={earnings}
                  dailyRate={dailyRate}
                  activeDevices={activeDevices}
                  uptime={uptime}
                />
              )}

              {currentTab === 'add-device' && (
                <AddDeviceTab
                  onDeviceAdded={handleDeviceAdded}
                  onOpenSetupGuide={() => setShowSetupGuide(true)}
                />
              )}

              {currentTab === 'docs' && <DocsTab />}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </PageLayout>
  );
};

export default DePIN;
