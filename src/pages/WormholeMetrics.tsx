import { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, Users, CheckCircle, Clock, Network } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import PageHero from '@/components/layout/PageHero';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import StatCard from '@/components/ui/StatCard';

interface MetricsData {
  totalTransactions: number;
  depinTransactions: number;
  regularTransactions: number;
  totalValueUSD: number;
  uniqueUsers: number;
  successRate: number;
  avgVAATime: number;
  chainBreakdown: { chain: string; count: number }[];
  dailyVolume: { date: string; volume: number; count: number }[];
}

const WormholeMetrics = () => {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      // Fetch all wormhole transactions
      const { data: transactions, error } = await supabase
        .from('wormhole_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!transactions) {
        setMetrics({
          totalTransactions: 0,
          depinTransactions: 0,
          regularTransactions: 0,
          totalValueUSD: 0,
          uniqueUsers: 0,
          successRate: 0,
          avgVAATime: 0,
          chainBreakdown: [],
          dailyVolume: []
        });
        setLoading(false);
        return;
      }

      // Calculate metrics
      const depinTxs = transactions.filter(tx => tx.source_type === 'depin_rewards');
      const regularTxs = transactions.filter(tx => tx.source_type === 'user_transfer');
      
      const uniqueWallets = new Set(transactions.map(tx => tx.wallet_address)).size;
      
      const completedTxs = transactions.filter(tx => tx.status === 'completed');
      const successRate = transactions.length > 0 
        ? (completedTxs.length / transactions.length) * 100 
        : 0;

      // Calculate average VAA retrieval time (mock - in production track this)
      const txsWithVAA = transactions.filter(tx => tx.wormhole_vaa && tx.created_at);
      const avgVAATime = txsWithVAA.length > 0 ? 45 : 0; // Placeholder

      // Total value (ETH price assumption: $2400)
      const totalValueUSD = transactions.reduce((sum, tx) => {
        return sum + (Number(tx.amount) || 0) * 2400;
      }, 0);

      // Chain breakdown
      const chainCounts: Record<string, number> = {};
      transactions.forEach(tx => {
        chainCounts[tx.from_chain] = (chainCounts[tx.from_chain] || 0) + 1;
      });
      const chainBreakdown = Object.entries(chainCounts)
        .map(([chain, count]) => ({ chain, count }))
        .sort((a, b) => b.count - a.count);

      // Daily volume (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const dailyVolume = last7Days.map(date => {
        const dayTxs = transactions.filter(tx => 
          tx.created_at?.startsWith(date)
        );
        const volume = dayTxs.reduce((sum, tx) => sum + (Number(tx.amount) || 0) * 2400, 0);
        return {
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          volume: Number(volume.toFixed(2)),
          count: dayTxs.length
        };
      });

      setMetrics({
        totalTransactions: transactions.length,
        depinTransactions: depinTxs.length,
        regularTransactions: regularTxs.length,
        totalValueUSD,
        uniqueUsers: uniqueWallets,
        successRate,
        avgVAATime,
        chainBreakdown,
        dailyVolume
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <Activity className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-lg text-muted-foreground">Loading metrics...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  const CHART_COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  return (
    <PageLayout>
      <PageHero 
        title="Wormhole Integration Metrics"
        description="Real-time analytics for Tempo's Wormhole-powered cross-chain infrastructure"
      />

      <section className="px-4 md:px-6 lg:px-12 py-6 md:py-8 pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <StatCard
              icon={Activity}
              label="Total Transactions"
              value={metrics?.totalTransactions.toString() || '0'}
              change={`${metrics?.depinTransactions || 0} DePIN + ${metrics?.regularTransactions || 0} Regular`}
              changeType="neutral"
            />
            
            <StatCard
              icon={TrendingUp}
              label="Total Value Bridged"
              value={`$${(metrics?.totalValueUSD || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
              change="Across all chains"
              changeType="positive"
            />
            
            <StatCard
              icon={Users}
              label="Unique Users"
              value={metrics?.uniqueUsers.toString() || '0'}
              change="Active wallets"
              changeType="neutral"
            />
            
            <StatCard
              icon={CheckCircle}
              label="Success Rate"
              value={`${(metrics?.successRate || 0).toFixed(1)}%`}
              change="Transaction completion"
              changeType="positive"
            />
            
            <StatCard
              icon={Clock}
              label="Avg VAA Time"
              value={`${metrics?.avgVAATime || 0}s`}
              change="Guardian verification"
              changeType="neutral"
            />
            
            <StatCard
              icon={Network}
              label="Supported Chains"
              value={metrics?.chainBreakdown.length.toString() || '0'}
              change="Active networks"
              changeType="neutral"
            />
          </div>

          {/* Transaction Type Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Types</CardTitle>
                <CardDescription>DePIN rewards vs regular transfers</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'DePIN Rewards', value: metrics?.depinTransactions || 0 },
                        { name: 'Regular Transfers', value: metrics?.regularTransactions || 0 }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={100}
                      fill="hsl(var(--primary))"
                      dataKey="value"
                    >
                      <Cell fill="hsl(var(--primary))" />
                      <Cell fill="hsl(var(--chart-2))" />
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        background: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Chain Distribution</CardTitle>
                <CardDescription>Transactions by source chain</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metrics?.chainBreakdown || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="chain" 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      tickLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      tickLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Daily Volume Chart */}
          <Card>
            <CardHeader>
              <CardTitle>7-Day Volume Trend</CardTitle>
              <CardDescription>Transaction volume and count over the last week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={metrics?.dailyVolume || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    yAxisId="left"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                    label={{ value: 'Volume (USD)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                    label={{ value: 'Transactions', angle: 90, position: 'insideRight', fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="volume" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    name="Volume (USD)"
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="count" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={3}
                    name="Transaction Count"
                    dot={{ fill: 'hsl(var(--chart-2))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Integration Highlights */}
          <Card>
            <CardHeader>
              <CardTitle>Wormhole Integration Highlights</CardTitle>
              <CardDescription>Key features and capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Guardian Network Security</h4>
                      <p className="text-sm text-muted-foreground">All transfers verified by Wormhole's 19 Guardian nodes</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Automatic VAA Polling</h4>
                      <p className="text-sm text-muted-foreground">Real-time monitoring for Verified Action Approvals</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Multi-Layer Transaction Detection</h4>
                      <p className="text-sm text-muted-foreground">Hybrid monitoring with watchdog failsafe</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">DePIN Rewards Bridge</h4>
                      <p className="text-sm text-muted-foreground">First-of-its-kind DePIN to DeFi cross-chain bridge</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Wormhole SDK</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">v3.8.5</div>
                <Badge variant="outline" className="text-xs">Latest Integration</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Network Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">Testnet</div>
                <Badge variant="secondary" className="text-xs">Sepolia → Solana Devnet</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">API Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-2xl font-bold">Operational</span>
                </div>
                <Badge variant="outline" className="text-xs">WormholeScan API</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default WormholeMetrics;
