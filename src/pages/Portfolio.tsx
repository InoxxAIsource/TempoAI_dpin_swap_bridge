import { Wallet, TrendingUp, Layers, Link2 } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import PageHero from '../components/layout/PageHero';
import StatCard from '../components/ui/StatCard';
import AssetCard from '../components/portfolio/AssetCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const Portfolio = () => {
  // Mock data
  const stats = [
    { icon: Wallet, label: 'Total Value', value: '$24,582.50', change: '+$1,234 (5.2%)', changeType: 'positive' as const },
    { icon: TrendingUp, label: '24h Change', value: '+5.2%', change: '+$1,234', changeType: 'positive' as const },
    { icon: Layers, label: 'Total Assets', value: '8', changeType: 'neutral' as const },
    { icon: Link2, label: 'Active Chains', value: '4', changeType: 'neutral' as const },
  ];

  const assets = [
    { name: 'Ethereum', symbol: 'ETH', balance: '3.45 ETH', value: '$8,234.50', chain: 'Ethereum', change: '+5.2%', changeType: 'positive' as const },
    { name: 'USD Coin', symbol: 'USDC', balance: '5,000 USDC', value: '$5,000.00', chain: 'Polygon', change: '0.0%', changeType: 'positive' as const },
    { name: 'Wrapped Bitcoin', symbol: 'WBTC', balance: '0.12 WBTC', value: '$5,234.00', chain: 'Arbitrum', change: '+3.8%', changeType: 'positive' as const },
    { name: 'Avalanche', symbol: 'AVAX', balance: '120 AVAX', value: '$3,456.00', chain: 'Avalanche', change: '+7.2%', changeType: 'positive' as const },
    { name: 'Solana', symbol: 'SOL', balance: '45 SOL', value: '$1,890.00', chain: 'Solana', change: '-2.3%', changeType: 'negative' as const },
    { name: 'Dai Stablecoin', symbol: 'DAI', balance: '768 DAI', value: '$768.00', chain: 'Ethereum', change: '0.0%', changeType: 'positive' as const },
  ];

  const chainData = [
    { name: 'Ethereum', value: 35, color: '#627EEA' },
    { name: 'Polygon', value: 20, color: '#8247E5' },
    { name: 'Arbitrum', value: 22, color: '#28A0F0' },
    { name: 'Avalanche', value: 14, color: '#E84142' },
    { name: 'Solana', value: 9, color: '#14F195' },
  ];

  return (
    <PageLayout>
      <PageHero 
        title="Portfolio"
        description="Track and manage your cross-chain assets in one unified dashboard"
      />

      {/* Stats Grid */}
      <section className="px-6 md:px-12 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Assets Grid */}
      <section className="px-6 md:px-12 py-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Your Assets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset, index) => (
              <AssetCard key={index} {...asset} />
            ))}
          </div>
        </div>
      </section>

      {/* Chain Distribution */}
      <section className="px-6 md:px-12 py-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="border border-border rounded-2xl p-8 bg-card">
            <h2 className="text-3xl font-bold mb-8">Chain Distribution</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chainData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chainData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                {chainData.map((chain, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chain.color }} />
                      <span className="font-medium">{chain.name}</span>
                    </div>
                    <span className="text-lg font-bold">{chain.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Portfolio;
