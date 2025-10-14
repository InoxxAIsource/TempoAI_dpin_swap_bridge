import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, TrendingUp, Coins, Link2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, XAxis, YAxis } from 'recharts';

interface PortfolioOverviewProps {
  userId: string;
}

const PortfolioOverview = ({ userId }: PortfolioOverviewProps) => {
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolioData();

    // Subscribe to updates
    const channel = supabase
      .channel('portfolio-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'depin_rewards',
        filter: `user_id=eq.${userId}`
      }, fetchPortfolioData)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'wormhole_transactions',
        filter: `user_id=eq.${userId}`
      }, fetchPortfolioData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const fetchPortfolioData = async () => {
    try {
      // Fetch DePIN rewards
      const { data: rewards } = await supabase
        .from('depin_rewards')
        .select('*')
        .eq('user_id', userId);

      const totalEarned = rewards?.reduce((sum, r) => sum + Number(r.amount), 0) || 0;
      const pendingRewards = rewards?.filter(r => r.status === 'pending').reduce((sum, r) => sum + Number(r.amount), 0) || 0;
      const claimedRewards = rewards?.filter(r => r.status === 'claimed').reduce((sum, r) => sum + Number(r.amount), 0) || 0;

      // Fetch bridge transactions
      const { data: transactions } = await supabase
        .from('wormhole_transactions')
        .select('*')
        .eq('user_id', userId);

      const inTransit = transactions?.filter(t => t.status === 'pending').reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      // Calculate daily earning rate (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentRewards = rewards?.filter(r => new Date(r.created_at) >= sevenDaysAgo) || [];
      const dailyRate = recentRewards.reduce((sum, r) => sum + Number(r.amount), 0) / 7;

      // Generate 30-day chart data
      const chartData = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayRewards = rewards?.filter(r => {
          const rewardDate = new Date(r.created_at);
          return rewardDate.toDateString() === date.toDateString();
        }).reduce((sum, r) => sum + Number(r.amount), 0) || 0;

        chartData.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: dayRewards
        });
      }

      // Chain distribution
      const chainBreakdown: { [key: string]: number } = {};
      rewards?.forEach(r => {
        const chain = r.chain || 'Unknown';
        chainBreakdown[chain] = (chainBreakdown[chain] || 0) + Number(r.amount);
      });

      const chainData = Object.entries(chainBreakdown).map(([name, value]) => ({
        name,
        value: Math.round((value / totalEarned) * 100)
      }));

      setPortfolioData({
        totalEarned,
        pendingRewards,
        claimedRewards,
        inTransit,
        dailyRate,
        chartData,
        chainData
      });
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Loading portfolio...</div>;
  }

  if (!portfolioData) {
    return <div className="text-center py-12 text-muted-foreground">No portfolio data available</div>;
  }

  const COLORS = ['#627EEA', '#8247E5', '#28A0F0', '#E84142', '#14F195'];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolioData.totalEarned.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All-time earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Rewards</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolioData.pendingRewards.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Ready to claim</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Daily Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolioData.dailyRate.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">7-day average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolioData.inTransit.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Being bridged</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>30-Day Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={portfolioData.chartData}>
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#627EEA" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chain Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={portfolioData.chainData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {portfolioData.chainData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PortfolioOverview;
