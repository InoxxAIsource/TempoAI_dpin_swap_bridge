import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface WorldwideStats {
  totalEarnings: number;
  solarEarnings: number;
  activeDevices: number;
  totalDeviceEvents: number;
}

const StatsSection = () => {
  const [stats, setStats] = useState<WorldwideStats>({
    totalEarnings: 0,
    solarEarnings: 0,
    activeDevices: 0,
    totalDeviceEvents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorldwideStats = async () => {
      try {
        // Fetch all rewards worldwide (aggregate across all users)
        const { data: allRewards } = await supabase
          .from('depin_rewards')
          .select('amount');

        // Fetch all active devices worldwide
        const { count: devicesCount } = await supabase
          .from('device_registry')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        // Fetch solar-specific devices and their earnings
        const { data: solarDevices } = await supabase
          .from('device_registry')
          .select('device_id')
          .eq('device_type', 'solar_panel')
          .eq('status', 'active');

        const solarDeviceIds = solarDevices?.map(d => d.device_id) || [];
        
        // Fetch total device events
        const { count: eventsCount } = await supabase
          .from('device_events')
          .select('*', { count: 'exact', head: true });

        // Calculate solar earnings from device events
        let solarEarnings = 0;
        if (solarDeviceIds.length > 0) {
          const { data: solarEvents } = await supabase
            .from('device_events')
            .select('reward_amount')
            .in('device_id', solarDeviceIds);
          
          solarEarnings = solarEvents?.reduce((sum, e) => sum + Number(e.reward_amount || 0), 0) || 0;
        }

        const totalEarnings = allRewards?.reduce((sum, r) => sum + Number(r.amount), 0) || 0;

        setStats({
          totalEarnings,
          solarEarnings,
          activeDevices: devicesCount || 0,
          totalDeviceEvents: eventsCount || 0
        });
      } catch (error) {
        console.error('Error fetching worldwide stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorldwideStats();
  }, []);

  const displayStats = [
    {
      value: loading ? '...' : `$${stats.totalEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      label: 'Worldwide DePIN Earnings'
    },
    {
      value: loading ? '...' : `$${stats.solarEarnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      label: 'Solar System Earnings'
    },
    {
      value: loading ? '...' : stats.activeDevices.toLocaleString(),
      label: 'Active Devices Worldwide'
    },
    {
      value: loading ? '...' : stats.totalDeviceEvents.toLocaleString(),
      label: 'Total Events Reported'
    }
  ];

  return (
    <section className="relative px-4 md:px-6 lg:px-12 py-16 md:py-24 lg:py-32">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {displayStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-5xl lg:text-6xl font-bold mb-2">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default StatsSection;