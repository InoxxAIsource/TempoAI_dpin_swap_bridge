import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PageLayout from '@/components/layout/PageLayout';
import PageHero from '@/components/layout/PageHero';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Plus, 
  MapPin, 
  Wallet, 
  Gift 
} from "lucide-react";
import OverviewTab from '@/components/depin/dashboard/OverviewTab';
import AddDeviceTab from '@/components/depin/dashboard/AddDeviceTab';
import TraceDevicesTab from '@/components/depin/dashboard/TraceDevicesTab';
import PortfolioTab from '@/components/depin/dashboard/PortfolioTab';
import ClaimTab from '@/components/depin/dashboard/ClaimTab';
import SetupGuideModal from '@/components/depin/SetupGuideModal';
import OnboardingModal from '@/components/depin/OnboardingModal';
import BatchClaimModal from '@/components/depin/BatchClaimModal';
import { useWalletContext } from '@/contexts/WalletContext';
import { useSearchParams, useNavigate } from 'react-router-dom';

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
  const { isAuthenticated, session } = useWalletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [devices, setDevices] = useState<Device[]>([]);
  const [earnings, setEarnings] = useState(0);
  const [activeDevices, setActiveDevices] = useState(0);
  const [uptime, setUptime] = useState(0);
  const [dailyRate, setDailyRate] = useState(0);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showBatchClaim, setShowBatchClaim] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [activeClaims, setActiveClaims] = useState<any[]>([]);
  const [authMethod, setAuthMethod] = useState<'wallet' | 'email' | null>(null);
  const navigate = useNavigate();

  const currentTab = searchParams.get('tab') || 'overview';

  const navigationItems = [
    {
      title: "Overview",
      value: "overview",
      icon: LayoutDashboard,
    },
    {
      title: "Add Device",
      value: "add-device",
      icon: Plus,
    },
    {
      title: "Trace Devices",
      value: "trace",
      icon: MapPin,
    },
    {
      title: "Portfolio",
      value: "portfolio",
      icon: Wallet,
    },
    {
      title: "Claim",
      value: "claim",
      icon: Gift,
      badge: activeClaims.length,
    },
  ];

  useEffect(() => {
    if (session?.user) {
      const provider = session.user.app_metadata?.provider;
      setAuthMethod(provider === 'email' ? 'email' : 'wallet');
    }
  }, [session]);

  // Check if user is visiting for the first time
  const checkFirstVisit = async () => {
    if (!isAuthenticated || !session?.user) return;

    const { data: existingDevices } = await supabase
      .from('device_registry')
      .select('id')
      .eq('user_id', session.user.id);

    if (!existingDevices || existingDevices.length === 0) {
      const hasSeenOnboarding = localStorage.getItem('depin_onboarding_seen');
      if (!hasSeenOnboarding) {
        setShowOnboarding(true);
        localStorage.setItem('depin_onboarding_seen', 'true');
      }
    }
  };

  // Demo setup
  const handleStartDemo = async () => {
    if (!session?.user) {
      toast.error('Please sign in to start demo');
      return;
    }

    try {
      await initializeDemo(session.user.id);
      setShowOnboarding(false);
      toast.success('Demo devices created! Simulation starting...');
      await fetchDevices();
    } catch (error: any) {
      toast.error('Failed to initialize demo');
    }
  };

  const handleConnectReal = () => {
    setShowOnboarding(false);
    handleTabChange('add-device');
  };

  const initializeDemo = async (userId: string) => {
    const demoDevices = [
      { type: 'solar-panel', name: 'Demo Solar Panel A', location: 'California, USA', capacity: '10kW' },
      { type: 'solar-panel', name: 'Demo Solar Panel B', location: 'Texas, USA', capacity: '15kW' },
      { type: 'weather-station', name: 'Demo Weather Station', location: 'New York, USA', capacity: 'N/A' },
    ];

    for (const device of demoDevices) {
      const deviceId = `${device.type}-demo-${Date.now()}-${Math.random()}`;
      await supabase.from('device_registry').insert({
        user_id: userId,
        device_id: deviceId,
        device_name: device.name,
        device_type: device.type,
        metadata: { location: device.location, capacity: device.capacity },
        status: 'active',
      });
    }
  };

  // Fetch devices
  const fetchDevices = async () => {
    try {
      const { data, error } = await supabase
        .from('device_registry')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setDevices(data);
        const active = data.filter((d) => d.status === 'active').length;
        setActiveDevices(active);

        const now = new Date().getTime();
        const onlineDevices = data.filter(
          (d) => d.last_seen_at && now - new Date(d.last_seen_at).getTime() < 5 * 60 * 1000
        );
        const avgUp = onlineDevices.length > 0 ? (onlineDevices.length / data.length) * 100 : 0;
        setUptime(avgUp);
      }
    } catch (error: any) {
      console.error('Error fetching devices:', error);
    }
  };

  // Fetch earnings
  const fetchEarnings = async () => {
    try {
      const { data, error } = await supabase
        .from('depin_rewards')
        .select('amount, created_at');

      if (error) throw error;

      if (data) {
        const total = data.reduce((sum, r) => sum + Number(r.amount), 0);
        setEarnings(total);

        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentRewards = data.filter((r) => new Date(r.created_at) > oneDayAgo);
        const daily = recentRewards.reduce((sum, r) => sum + Number(r.amount), 0);
        setDailyRate(daily);
      }
    } catch (error: any) {
      console.error('Error fetching earnings:', error);
    }
  };

  // Fetch active claims
  const fetchActiveClaims = async () => {
    try {
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('depin_reward_claims')
        .select('*')
        .eq('user_id', session.user.id)
        .in('status', ['pending', 'contract_prepared', 'ready_to_claim'])
        .order('claimed_at', { ascending: false });

      if (error) throw error;
      if (data) setActiveClaims(data);
    } catch (error: any) {
      console.error('Error fetching claims:', error);
    }
  };

  // Delete device
  const handleDeleteDevice = async (deviceId: string) => {
    try {
      const { error } = await supabase
        .from('device_registry')
        .delete()
        .eq('id', deviceId);

      if (error) throw error;
      toast.success('Device deleted successfully');
      fetchDevices();
    } catch (error: any) {
      toast.error('Failed to delete device');
    }
  };

  // Device added callback
  const handleDeviceAdded = () => {
    fetchDevices();
  };

  // Start simulation
  const startSimulation = async () => {
    try {
      await supabase.functions.invoke('simulate-device-events');
    } catch (error) {
      console.log('Simulation not started:', error);
    }
  };

  useEffect(() => {
    checkFirstVisit();
    fetchDevices();
    fetchEarnings();
    fetchActiveClaims();

    const fetchUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    fetchUserId();

    // Real-time updates
    const channel = supabase
      .channel('depin-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'device_registry'
      }, () => {
        fetchDevices();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'depin_rewards'
      }, () => {
        fetchEarnings();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'depin_reward_claims'
      }, () => {
        fetchActiveClaims();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user]);

  useEffect(() => {
    if (isAuthenticated && session?.user) {
      startSimulation();
    }
  }, [isAuthenticated, session?.user]);

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  // Prepare device breakdown for batch claim
  const deviceBreakdown = devices.map(d => ({
    deviceId: d.device_id,
    deviceName: d.device_name,
    amount: 10.5 // Mock amount
  }));

  const pendingRewards = earnings;

  return (
    <PageLayout>
      <PageHero 
        title="DePIN Dashboard" 
        description="Manage your Decentralized Physical Infrastructure devices and earnings"
      />
      
      <OnboardingModal 
        open={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onStartDemo={handleStartDemo}
        onConnectReal={handleConnectReal}
        isAuthenticated={isAuthenticated}
        authMethod={authMethod}
        onShowWalletModal={() => setShowWalletModal(true)}
        onNavigateToAuth={() => navigate('/auth')}
      />

      <SetupGuideModal 
        open={showSetupGuide}
        onClose={() => setShowSetupGuide(false)}
        deviceId={selectedDeviceId || 'demo-device'}
      />

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

      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          {/* Left Sidebar */}
          <Sidebar className="border-r">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.value}>
                        <SidebarMenuButton
                          onClick={() => handleTabChange(item.value)}
                          isActive={currentTab === item.value}
                          className="w-full"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          {item.badge && item.badge > 0 && (
                            <Badge className="ml-auto h-5 w-5 p-0 flex items-center justify-center" variant="destructive">
                              {item.badge}
                            </Badge>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          {/* Right Content Area */}
          <SidebarInset className="flex-1">
            {/* Header with Toggle */}
            <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-6 lg:px-8">
              <SidebarTrigger />
              <h2 className="text-lg font-semibold">
                {navigationItems.find(item => item.value === currentTab)?.title || 'Dashboard'}
              </h2>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
              <div className="px-4 md:px-6 lg:px-8 py-6">
                <div className="max-w-7xl mx-auto">
                  {currentTab === 'overview' && (
                    <OverviewTab onNavigateToTab={handleTabChange} />
                  )}

                  {currentTab === 'add-device' && (
                    <AddDeviceTab 
                      onDeviceAdded={() => {
                        handleDeviceAdded();
                        handleTabChange('trace');
                      }}
                      onOpenSetupGuide={() => setShowSetupGuide(true)}
                    />
                  )}

                  {currentTab === 'trace' && (
                    <TraceDevicesTab devices={devices} />
                  )}

                  {currentTab === 'portfolio' && (
                    <PortfolioTab 
                      earnings={earnings}
                      dailyRate={dailyRate}
                      activeDevices={activeDevices}
                      uptime={uptime}
                    />
                  )}

                  {currentTab === 'claim' && (
                    <ClaimTab 
                      pendingRewards={pendingRewards}
                      activeClaims={activeClaims}
                      onClaimClick={() => setShowBatchClaim(true)}
                    />
                  )}
                </div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </PageLayout>
  );
};

export default DePIN;
