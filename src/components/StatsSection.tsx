import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useWalletContext } from '@/contexts/WalletContext';

interface EarningStats {
  totalEarnings: number;
  pendingRewards: number;
  claimedRewards: number;
  activeDevices: number;
}

const StatsSection = () => {
  const { isAuthenticated } = useWalletContext();
  const [stats, setStats] = useState<EarningStats>({
    totalEarnings: 0,
    pendingRewards: 0,
    claimedRewards: 0,
    activeDevices: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarningStats = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch rewards data
        const { data: rewards } = await supabase
          .from('depin_rewards')
          .select('amount, status')
          .eq('user_id', user.id);

        // Fetch active devices count
        const { count: devicesCount } = await supabase
          .from('device_registry')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'active');

        if (rewards) {
          const total = rewards.reduce((sum, r) => sum + Number(r.amount), 0);
          const pending = rewards
            .filter(r => r.status === 'pending')
            .reduce((sum, r) => sum + Number(r.amount), 0);
          const claimed = rewards
            .filter(r => r.status === 'claimed')
            .reduce((sum, r) => sum + Number(r.amount), 0);

          setStats({
            totalEarnings: total,
            pendingRewards: pending,
            claimedRewards: claimed,
            activeDevices: devicesCount || 0
          });
        }
      } catch (error) {
        console.error('Error fetching earning stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEarningStats();
  }, [isAuthenticated]);

  const displayStats = [
    {
      value: loading ? '...' : `$${stats.totalEarnings.toFixed(2)}`,
      label: 'Total Earnings'
    },
    {
      value: loading ? '...' : `$${stats.pendingRewards.toFixed(2)}`,
      label: 'Pending Rewards'
    },
    {
      value: loading ? '...' : `$${stats.claimedRewards.toFixed(2)}`,
      label: 'Claimed Rewards'
    },
    {
      value: loading ? '...' : stats.activeDevices.toString(),
      label: 'Active Devices'
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