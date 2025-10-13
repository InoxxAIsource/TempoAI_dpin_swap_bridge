import { useState, useEffect } from 'react';
import { Activity, Zap, Clock, TrendingUp, Plus } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import PageHero from '../components/layout/PageHero';
import StatCard from '../components/ui/StatCard';
import DeviceCard from '../components/depin/DeviceCard';
import WorldMap from '../components/depin/WorldMap';
import OnboardingModal from '../components/depin/OnboardingModal';
import ExplainerPanel from '../components/depin/ExplainerPanel';
import AddDeviceModal from '../components/depin/AddDeviceModal';
import SetupGuideModal from '../components/depin/SetupGuideModal';
import RewardsCalculator from '../components/depin/RewardsCalculator';
import ProcessFlowSection from '../components/depin/ProcessFlowSection';
import FloatingHelpButton from '../components/depin/FloatingHelpButton';
import { Button } from '../components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useWalletContext } from '@/contexts/WalletContext';
import { useNavigate } from 'react-router-dom';

interface Device {
  id: string;
  device_id: string;
  device_name: string;
  device_type: string;
  status: string;
  is_verified: boolean;
  metadata: any;
  last_seen_at: string;
}

const DePIN = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [activeDevices, setActiveDevices] = useState(0);
  const [avgUptime, setAvgUptime] = useState(0);
  const [dailyRate, setDailyRate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, authMethod, walletAuthenticatedAddress, isSolanaConnected, isAnyWalletConnected } = useWalletContext();
  const navigate = useNavigate();
  const [connectionDebugInfo, setConnectionDebugInfo] = useState('');

  useEffect(() => {
    checkFirstVisit();
    fetchDevices();
    fetchEarnings();
    startSimulation();

    // Real-time updates
    const channel = supabase
      .channel('depin-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'device_events'
      }, () => {
        fetchDevices();
        fetchEarnings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Validate wallet connection state
  useEffect(() => {
    const validateWalletState = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // If session exists but wallet is disconnected, show warning
      if (session?.user?.user_metadata?.wallet_address && !isAnyWalletConnected) {
        toast({
          title: "Wallet Disconnected",
          description: "Please reconnect your wallet to continue using DePIN features",
          variant: "destructive",
        });
      }
    };
    
    validateWalletState();
  }, [isAnyWalletConnected]);

  // Connection status debugger
  useEffect(() => {
    const debugParts = [];
    
    if (isSolanaConnected) {
      debugParts.push('🟢 Wallet Connected');
    } else {
      debugParts.push('🔴 Wallet Disconnected');
    }
    
    if (isAuthenticated) {
      debugParts.push('✅ Authenticated');
      if (authMethod === 'wallet') {
        debugParts.push('(via Wallet)');
      } else if (authMethod === 'email') {
        debugParts.push('(via Email)');
      }
    } else if (isSolanaConnected) {
      debugParts.push('⏳ Awaiting Signature');
    }
    
    if (walletAuthenticatedAddress) {
      debugParts.push(`Address: ${walletAuthenticatedAddress.slice(0, 6)}...${walletAuthenticatedAddress.slice(-4)}`);
    }
    
    setConnectionDebugInfo(debugParts.join(' | '));
  }, [isSolanaConnected, isAuthenticated, authMethod, walletAuthenticatedAddress]);

  const checkFirstVisit = async () => {
    const hasVisited = localStorage.getItem('depin_visited');
    if (!hasVisited) {
      setShowOnboarding(true);
      localStorage.setItem('depin_visited', 'true');
    }
  };

  const handleStartDemo = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please connect your wallet or login to start demo",
        action: (
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={() => setShowWalletModal(true)}>
              Connect Wallet
            </Button>
            <Button size="sm" variant="outline" onClick={() => navigate('/auth')}>
              Login
            </Button>
          </div>
        ),
      });
      return;
    }
    await initializeDemo();
    fetchDevices();
  };

  const handleConnectReal = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please connect your wallet or login to add devices",
        action: (
          <div className="flex gap-2 mt-2">
            <Button size="sm" onClick={() => setShowWalletModal(true)}>
              Connect Wallet
            </Button>
            <Button size="sm" variant="outline" onClick={() => navigate('/auth')}>
              Login
            </Button>
          </div>
        ),
      });
      return;
    }
    setShowAddDevice(true);
  };

  const handleOpenSetupGuide = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    setShowSetupGuide(true);
  };

  const initializeDemo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User session not found');
      }

      // Additional validation for wallet-authenticated users
      if (authMethod === 'wallet' && !walletAuthenticatedAddress) {
        throw new Error('Wallet authentication incomplete');
      }

      // Check if user already has devices
      const { data: existingDevices } = await supabase
        .from('device_registry')
        .select('id')
        .eq('user_id', user.id);

      if (existingDevices && existingDevices.length > 0) {
        toast({
          title: 'Demo Already Created',
          description: 'You already have devices registered',
        });
        return;
      }

      // Create 5 simulated solar panels for demo
      const locations = ['California', 'Texas', 'Florida', 'Arizona', 'Nevada'];
      const devices = locations.map((location, index) => ({
        user_id: user.id,
        device_id: `solar_${index + 1}`,
        device_type: 'solar_panel',
        device_name: `Solar Panel #${index + 1}`,
        is_verified: false,
        metadata: {
          location,
          capacity_kw: 20 + (index * 5)
        }
      }));

      await supabase.from('device_registry').insert(devices);
      toast({
        title: 'Demo Devices Created',
        description: '5 demo solar panels have been added to your network',
      });
      console.log('✅ Demo devices created');
    } catch (error: any) {
      console.error('Error initializing demo:', error);
      toast({
        title: 'Error Creating Demo',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const startSimulation = () => {
    // Call simulate-device-events every 30 seconds
    const interval = setInterval(async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        await fetch(`${supabaseUrl}/functions/v1/simulate-device-events`, {
          method: 'POST',
        });
      } catch (error) {
        console.error('Error calling simulation:', error);
      }
    }, 30000);

    // Call once immediately
    setTimeout(async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        await fetch(`${supabaseUrl}/functions/v1/simulate-device-events`, {
          method: 'POST',
        });
      } catch (error) {
        console.error('Error calling simulation:', error);
      }
    }, 2000);

    return () => clearInterval(interval);
  };

  const fetchDevices = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('device_registry')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDevices(data || []);
      setActiveDevices(data?.filter(d => d.status === 'active').length || 0);

      // Calculate average uptime from recent events
      if (data && data.length > 0) {
        const deviceIds = data.map(d => d.device_id);
        const { data: events } = await supabase
          .from('device_events')
          .select('metrics')
          .in('device_id', deviceIds)
          .order('created_at', { ascending: false })
          .limit(50);

        if (events && events.length > 0) {
          const uptimes = events
            .map(e => {
              const metrics = e.metrics as any;
              return metrics?.uptime_percent || 0;
            })
            .filter(u => u > 0);
          
          if (uptimes.length > 0) {
            const avgUptimeCalc = uptimes.reduce((sum, u) => sum + u, 0) / uptimes.length;
            setAvgUptime(parseFloat(avgUptimeCalc.toFixed(1)));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
      toast({
        title: 'Error',
        description: 'Failed to load devices',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchEarnings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('depin_rewards')
        .select('amount, created_at')
        .eq('user_id', user.id);

      if (error) throw error;
      
      const total = data?.reduce((sum, r) => sum + parseFloat(r.amount.toString()), 0) || 0;
      setTotalEarnings(total);

      // Calculate daily rate from last 24 hours
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const recentRewards = data?.filter(r => r.created_at > oneDayAgo) || [];
      const dailyTotal = recentRewards.reduce((sum, r) => sum + parseFloat(r.amount.toString()), 0);
      setDailyRate(dailyTotal);
    } catch (error) {
      console.error('Error fetching earnings:', error);
    }
  };

  const handleDeleteDevice = async (deviceId: string) => {
    try {
      const { error } = await supabase
        .from('device_registry')
        .delete()
        .eq('id', deviceId);
      
      if (error) throw error;
      
      toast({
        title: 'Device Deleted',
        description: 'The device has been removed successfully',
      });
      
      fetchDevices();
    } catch (error: any) {
      toast({
        title: 'Delete Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const stats = [
    { 
      icon: Activity, 
      label: 'Active Devices', 
      value: activeDevices.toString(),
      changeType: 'neutral' as const 
    },
    { 
      icon: Zap, 
      label: 'Total Earnings', 
      value: `$${totalEarnings.toFixed(2)}`,
      change: '+12.5%',
      changeType: 'positive' as const 
    },
    { 
      icon: Clock, 
      label: 'Avg Uptime', 
      value: `${avgUptime}%`,
      changeType: 'positive' as const 
    },
    { 
      icon: TrendingUp, 
      label: 'Daily Rate', 
      value: `$${dailyRate.toFixed(2)}`,
      change: '+5.2%',
      changeType: 'positive' as const 
    },
  ];

  return (
    <PageLayout>
      <PageHero 
        title="DePIN Network"
        description="Monitor your physical infrastructure devices and track cross-chain rewards"
      />

      {/* Connection Status Debug Info */}
      {connectionDebugInfo && (
        <div className="mb-4 p-3 bg-muted/50 border border-border rounded-lg">
          <p className="text-xs font-mono text-center text-muted-foreground">
            {connectionDebugInfo}
          </p>
        </div>
      )}

      {/* Onboarding Modal */}
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

      {/* Add Device Modal */}
      <AddDeviceModal
        open={showAddDevice}
        onClose={() => setShowAddDevice(false)}
        onDeviceAdded={fetchDevices}
        onOpenSetupGuide={handleOpenSetupGuide}
      />

      {/* Setup Guide Modal */}
      <SetupGuideModal
        open={showSetupGuide}
        onClose={() => setShowSetupGuide(false)}
        deviceId={selectedDeviceId}
      />

      {/* Stats Grid */}
      <section className="px-4 md:px-6 lg:px-12 py-6 md:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* World Map Section */}
      <section className="px-4 md:px-6 lg:px-12 py-6 md:py-8 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <ExplainerPanel />
          <div className="mb-4 md:mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Global Device Network</h2>
            <p className="text-muted-foreground">
              Real-time monitoring of distributed infrastructure across locations
            </p>
          </div>
          <WorldMap devices={devices} />
        </div>
      </section>

      {/* Process Flow */}
      <section className="px-4 md:px-6 lg:px-12 py-6 md:py-8">
        <div className="max-w-6xl mx-auto">
          <ProcessFlowSection />
        </div>
      </section>

      {/* Rewards Calculator & Device Grid */}
      <section className="px-4 md:px-6 lg:px-12 py-6 md:py-8 pb-16 md:pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
            <div className="lg:col-span-1">
              <RewardsCalculator
                deviceCount={devices.length}
                avgKwhPerDay={35}
                verifiedDeviceCount={devices.filter(d => d.is_verified).length}
              />
            </div>
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4 md:mb-6 gap-2">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">Your Devices</h2>
                  {authMethod && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Authenticated via {authMethod === 'wallet' ? 'Wallet' : 'Email'}
                    </p>
                  )}
                </div>
                <Button 
                  onClick={handleConnectReal} 
                  className="gap-2 text-sm md:text-base"
                  disabled={!isAuthenticated}
                >
                  <Plus className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">Add Device</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </div>
          
          {loading ? (
            <div className="text-center py-8 md:py-12 text-muted-foreground text-sm md:text-base">Loading devices...</div>
          ) : devices.length === 0 ? (
            <div className="border border-border rounded-2xl p-6 md:p-12 text-center">
              <Activity className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 text-muted-foreground" />
              <h3 className="text-lg md:text-xl font-semibold mb-2">No Devices Yet</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4">Connect your first device to start earning rewards</p>
              <Button onClick={() => setShowAddDevice(true)} className="gap-2 text-sm md:text-base">
                <Plus className="w-3 h-3 md:w-4 md:h-4" />
                Add Your First Device
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {devices.map((device) => (
                <DeviceCard key={device.id} device={device} onDelete={handleDeleteDevice} />
              ))}
            </div>
          )}
            </div>
          </div>
        </div>
      </section>

      <FloatingHelpButton />
    </PageLayout>
  );
};

export default DePIN;
